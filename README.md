# Relay Gallery

![alt tag](http://reactjscamp.com/images/roger-stack.png)

Relay Gallery is a demonstration of how to use React + Relay + Graphql(Facebook Frontend 3 broad axes).


> There's not much documents on how Relay deal with login or file upload. This project is a
> Demo gallery site which user can login and upload images to the gallery. From here we can
> learn how Relay mutations really work.

### Live Demo

[fanjin.computer]

### Version
0.6.0

### Tech

Relay Gallery uses a number of open source projects to work properly:

* [React] - js liberary
* [Relay] - framework for react
* [Graphql] - the future API
* [Material-ui] - great UI for modern web apps
* [Node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework
* [Webpack] - module builder
* [Babel] - es6 compiler
* [Redis] - nosql database


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
$ npm dev-server
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
Use [ngx_http_image_filter_module] to make the image load faster!


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



[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [ngx_http_image_filter_module]: <http://nginx.org/en/docs/http/ngx_http_image_filter_module.html>
   [fanjin.computer]: <http://fanjin.computer/>
   [React]: <http://facebook.github.io/react/>
   [Relay]: <https://facebook.github.io/relay/>
   [Graphql]:  <https://github.com/facebook/graphql>
   [Material-ui]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [Webpack]: <https://webpack.github.io/>
   [Node.js]: <http://nodejs.org>
   [Express]: <http://expressjs.com>
   [Babel]: <https://babeljs.io/>
   [Redis]: <http://redis.io//>




