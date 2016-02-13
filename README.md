# Relay Gallery

Relay Gallery is a demonstration of how to use React + Relay + Graphql(Facebook Frontend 3 broad axes).


> There's not much documents on how Relay deal with login or file upload. This project is a
> Demo gallery site which user can login and upload images to the gallery. From here we can
> learn how Relay mutations really work.

### Live Demo
http://159.203.31.187/

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
$ cd server && npm install
$ npm start
```
Now the server is running on port `3000`

If you want to develop frontend
```sh
$ cd frontent && npm install
$ npm start
```

Build frontend to production
```sh
$ cd frontent && npm install
$ npm run build
```

### Trouble shooting
Any issue with build or development please fire a issue.

### Development

Want to contribute? Great!
Open your favorite Terminal and run these commands.

First Tab:
```sh
$ cd frontent && npm start
```

Second Tab:
```sh
$ cd server && npm start
```


### NGINX config

More details coming soon.


### Todos

 - Add delete pictures feature
 - Modularization
 - Add Code Comments

License
----

MIT



[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [React]: <http://facebook.github.io/react/>
   [Relay]: <https://facebook.github.io/relay/>
   [Graphql]:  <https://github.com/facebook/graphql>
   [Material-ui]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [Webpack]: <https://webpack.github.io/>
   [Node.js]: <http://nodejs.org>
   [Express]: <http://expressjs.com>
   [Babel]: <https://babeljs.io/>
   [Redis]: <http://redis.io//>




