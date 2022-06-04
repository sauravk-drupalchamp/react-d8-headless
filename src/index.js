import React from 'react'
import ReactDOM from 'react-dom'
import events from 'events'
import ajax from './ajax'

// Create an emitter object so that we can do pub/sub
const emitter = new events.EventEmitter();

const App = () => (
  <div>
    <p>Node creation and deletion works only if are logged into Drupal as a user with appropriate permissions.</p>
    <NodeForm />
    <NodeList />
  </div>
)

// component to show a list of nodes
class NodeList extends React.Component {
  constructor() {
    super()
    this.state = {
      nodes: []
    }
    this.refresh = this.refresh.bind(this)
  }

  componentWillMount() {
    emitter.addListener('NODE_UPDATED', this.refresh)
  }

  componentWillUnmount() {
    emitter.addListener('NODE_UPDATED', this.refresh)
  }

  async componentDidMount() {
    await this.refresh()
  }

  async refresh() {
    // AJAX fetch server/node/rest?_format=json and setState with the response data
    try {
      const axios = await ajax() // wait for an initialized axios object
      const response = await axios.get('/node/rest') // wait for the POST AJAX request to complete
      if (response.data) {
        // setState will trigger repaint
        this.setState({ nodes: response.data })
      }
      } catch (e) {
      alert(e)
    }
  }

  render() {
    const deleteNode = async (nid) => {
      try {
        const axios = await ajax() // wait for an initialized axios object
        const response = await axios.delete(`/node/${nid}`) // wait for the DELETE AJAX request to complete
        console.log('Node deleted', response)
        emitter.emit('NODE_UPDATED')
      } catch (e) {
        alert(e)
      }
    }
    return (
      <table>
        <caption>Nodes promoted to front page</caption>
        <thead>
          <tr>
            <td>NID</td>
            <td>Title</td>
            <td>Delete</td>
          </tr>
        </thead>
        <tbody>
          {this.state.nodes.map((node, index) => {
            // iterate over the nodes array and map them to "li" elements
            return (
              <tr key={index}>
                <td>{node.nid}</td>
                <td><a href={node.path} target="_blank">{node.title}</a></td>
                <td><button onClick={e => deleteNode(node.nid)}>x</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}

const NodeForm = () => {
  const data = {}
  // note the 'async' keyword, it allows us to call 'await' later
  const handleSubmit = async (e) => {
    e.preventDefault()
    var node = {
      type: [{
        target_id: 'article',
        target_type: 'node_type',
      }],
      title: [{
        value: data.title,
      }],
      body: [{
        value: data.body,
        format: 'plain_text',
      }],
    };
    try {
      const axios = await ajax() // wait for an initialized axios object
      const response = await axios.post('/node', node) // wait for the POST AJAX request to complete
      console.log('Node created: ', response)
      emitter.emit('NODE_UPDATED')
    } catch (e) {
      alert(e)
    }
  }
  const handleChange = (e, propName) => {
    data[propName] = e.target.value
  }

  return (
    <div>
      <h4>Create Node</h4>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <br />
        <input type="text" onChange={e => handleChange(e, 'title')}></input>
        <br />
        <label>Body</label>
        <br />
        <textarea onChange={e => handleChange(e, 'body')}></textarea>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))