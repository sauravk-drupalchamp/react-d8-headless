Headless Drupal + ReactJS: Step by step
=======================================
This is a sample project to demonstrate how to configure Drupal to expose REST services
to serve and manipulate content, and how to write JavaScript applications in ReactJS that
consume Drupal's REST services and provide a user-friendly application front-end for users.

The accompanying presentation slides can be viewed [here](https://docs.google.com/presentation/d/1xEbP8g_4h2hpmPRwtOWFV1FRvL31qYa-zW8L3FaA8eM/edit).

Drupal Configuration
--------------------
The `drupal/headless` folder contains a custom module that has the appropriate files
to configure Drupal. You can copy this module to your Drupal installation and enable
it in your site. It will do the following:

* `headless.info.yml` - enable dependency modules
    * `rest` - enables restful services in Drupal
    * `serialization` - required by `rest` module, provides JSON serialization
* `headless.services.yml` - CORS configuration (Cross-Origin Resource Sharing)
    * set CORS enabled: true
    * specify allowedHeaders
    * specify allowedMethods
    * specify allowedOrigins - this must match the URL of your JavaScript site.
    * set supportsCredentials: true
* `config/install/rest.resource.entity.node.yml` - enable and configure REST services
    * plugin_id: 'entity:node' (this is what serves up nodes)
    * granularity: resource
    * methods: GET (for retrieval), POST (for node creation), DELETE (for node deletion), PATCH (for node update)
    * formats: json
    * authentication: cookie (to reuse existing login session)
* `config/install/views.view.node_list_rest.yml` - a view that serves up a list of nodes RESTfully over JSON.

You could also use the config YAML files individually as-is or after modification by importing
them into your Drupal instance. That way, you can exercise fine grained control over it.

ReactJS Application
-------------------
This is a fairly standard ReactJS application that consumes Drupal's REST services to retrieve,
create, and delete nodes. The unusual thing is in `src/ajax.js`. That's where we create an
instance of Axios client that always sends the X-CSRF-Token header and authentication cookie
with every AJAX request.

How to use
----------
* Enable the module (above) or use the config files in the module individually.
* Create some sample content in your Drupal site either by hand, or with *Devel Generate* module.
* Install npm and nodejs.
* Run `npm install` in project root directory. This will download dependencies.
* Copy `src/config.sample.js` to `src/config.js` and edit it, pointing it to your Drupal base URL.
* Adjust allowedOrigins setting in your Drupal config, if the JavaScript app is going to run from
  somewhere other than `localhost:3000`
* Run one of the following commands.
    * `npm run build` - to generate optimized output in `dist` directory. This can then be served
       by any web server that can serve static files.
    * `npm run dev` - for active development with hot-reloading.
* Visit your JavaScript app in browser (http://localhost:3000/ if running from `npm run dev`)
* Log into your Drupal site in another browser tab, so that the JavaScript app can use that session.
* Create new nodes using the node creation form in the app, and watch them show up in the list below.
* View or delete the nodes in the list below.
* Observe what's going on under-the-hood by opening the `Networking` tab of your browser's dev tools.
