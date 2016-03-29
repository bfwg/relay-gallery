# Relay Gallery

![alt tag](http://reactjscamp.com/images/roger-stack.png)

Relay Gallery is a demonstration of how to use React + Relay + Graphql(Facebook Frontend 3 broad axes).


> There's not much documents on how Relay deal with login or file upload. This project is a
> Demo gallery site which user can login and upload images to the gallery. From here we can
> learn how Relay mutations really work.

### Live Demo

[fanjin.computer](http://fanjin.computer/)

### Version
0.6.0

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



### Installation

The default database is using Redis so you need to install redis
http://redis.io/

After clone the repo
```sh
$ npm install
$ npm start
```
Now the server is running on port `3000`

If you want to develop frontend
```sh
$ npm run dev-server
```

Build frontend to production
```sh
$ npm run build
```

### Trouble shooting
Any issue with build or development please fire a issue.

### Development

Want to contribute? Great!
Open your favorite Terminal and run these commands.

First Tab: (frontend at port default:3001)
```sh
$ npm run dev-server
```

Second Tab: (server at port default:3000)
```sh
$ npm start
```


### NGINX config
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

### Todos

 - Add delete pictures feature
 - Modularization
 - Add more code comments

License
----

MIT






