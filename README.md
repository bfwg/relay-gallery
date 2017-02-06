# Relay Gallery
[![npm version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=js&type=6&v=1.0.0&x2=0)](https://www.npmjs.com/package/relay-gallery)
[![Maintenance Status][status-image]][status-url]
[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/bfwg/relay-gallery/blob/master/LICENSE)

![alt tag](http://fanjin.computer/images/0b60b3bb86521cc51c4633e06d72e9bd.png)

Relay Gallery is a demonstration of how to use React + Relay + Graphql.

Google can easily find Relay Gallery because it is using Isomorphic Relay for server side rendering. Inspect into browser source for details.

> There's not much documents on how Relay deal with login or file upload. This project is a
> Demo gallery site which user can login and upload images to the gallery. From here we can
> learn how Relay mutations really work.

### Live Demo

[fanjin.computer](http://fanjin.computer/)

### Version
1.0.0

### Underlying technologies

| **Technology** | **Description**|
|----------------|----------------|
| [React](https://facebook.github.io/react/) | Library for building SPA. |
| [Material UI](http://www.material-ui.com/) | Library for implementing Material Design in React. All user interface in this kit is built exclusively with Material UI components. |
| [Relay](https://facebook.github.io/relay/) | A Javascript framework for building data-driven react applications. |
| [GraphQL](https://facebook.github.io/graphql/) | A query language created by Facebook in 2012 for describing the capabilities and requirements of data models for client‐server applications. |
| [Express GraphQL](https://github.com/graphql/express-graphql) | A Node.js express library that allows the creation of GraphQL servers. |
| [Isomorphic Relay](https://github.com/denvned/isomorphic-relay) | Adds server side rendering support to React Relay. IMRSK fully utilizes this library, while waiting for [https://github.com/facebook/relay/issues/589](https://github.com/facebook/relay/issues/589). The eventual goal is to have full isomorphism with authentication. |
| [Redis](http://redis.io/) | In-memory data structure store, used as database and cache. |
| [React Helmet](https://github.com/nfl/react-helmet) | Reusable React component will manage all of your changes to the document head with support for document title, meta, link, script, and base tags. |
| [ESLint](http://eslint.org/) | Pluggable linting utility for JavaScript and JSX. |
| [Babel](http://babeljs.io) | Compiles ES6/ES7 to ES5. Allows using features from ES6 and ES7 today. |
| [Webpack](http://webpack.github.io) | Bundles npm packages and the application Java Script into a single file. Includes hot reloading via [react-transform-hmr](https://www.npmjs.com/package/react-transform-hmr). Also, Webpack can bundle any required CSS. |
| [Node.js](https://nodejs.org)| Event-driven, non-blocking I/O runtime based on JavaScript that is lightweight and efficient. |
| [npm Scripts](https://docs.npmjs.com/misc/scripts)| Glues all this together in a handy automated build. |
Nice table from [isomorphic-material-relay-starter-kit](https://github.com/codefoundries/isomorphic-material-relay-starter-kit)



## Quick Start

```sh
# clone our repo
# --depth 1 removes all but one .git commit history
git clone --depth 1 https://github.com/bfwg/relay-gallery.git

# change directory to our repo
cd relay-gallery

# install the repo with npm
npm install

# start the app
npm start

# the frontent React/Relay app will be running on port 3001
# the backend graphql server will be running on port 3000
# webpack-dev-server proxy requests to from port 3001 to 3000

# update graphql schema
npm run update-schema
```

The default database is using Redis so you need to install redis
http://redis.io/
```sh
# start Redis server make sure it is running on port 6379
redis-server
# start Redis cli and setup a username/password for image upload authentication
redis-cli
# set User
# user1:123
127.0.0.1:6379> set user1 "{ \"password\": \"123\"}"
```

Build and run app for production
```sh
npm run build
npm run server:prod
```

### Trouble shooting
Any issue with build or development please fire a issue.

### Development

Want to contribute? Great!
Create an issue or fork this repo and make a pull request.


### NGINX config
If you are using Nginx for your production server
Use [ngx_http_image_filter_module](http://nginx.org/en/docs/http/ngx_http_image_filter_module.html) to make the image load faster!


 ```
 server {
        listen 3005;

        root /xxx/xxx/projects/relay-gallery/static;

        location / {
                proxy_set_header x-forwarded-host $host;
                proxy_set_header x-forwarded-server $host;
                proxy_set_header x-forwarded-for $proxy_add_x_forwarded_for;
                proxy_pass              http://localhost:3000;
        }

        location ~ /(graphql|login|upload) {
              proxy_pass http://localhost:3000;
        }



        location ~ /images/(.*)$ {

            set $width "-";
            set $quality "75";
            if ($arg_w != '')
            {
              set $width $arg_w;
            }
            if ($arg_q != '')
            {
              set $quality $arg_q;
            }

            image_filter resize $width -;
            image_filter_jpeg_quality $quality;
        }

 }

```

### More Info

For more code, build folder structure info, please checkout the following:

[material-ui-webpack-example](https://github.com/callemall/material-ui-webpack-example/tree/25938ac6f5db94645e6ea9f24a903792d3133c5d)

[relay-examples](https://github.com/relayjs/relay-examples)

License
----

 [MIT](/LICENSE)

[status-image]: https://img.shields.io/badge/status-maintained-brightgreen.svg
[status-url]: https://github.com/bfwg/relay-gallery





