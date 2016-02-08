'use strict';

const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;
const graphQLHTTP = require('express-graphql');
const querySchema = require('./schema/schema').schema;

const cors = require('cors');

const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const multer = require('multer');
//mercy due to issue https://github.com/graphql/express-graphql/issues/40

app.use(cors());
app.use(cookieParser());
app.use(session({
  name: 'c.sid',
  store: new RedisStore(),
  secret: 'keyboard cat',
  cookie: { maxAge: 600000 },
  resave: true,
  saveUninitialized: false,
}));


app.listen(PORT, '192.168.1.66', () => {
  console.log('node ' + process.version + ' listen on port ' + PORT + '(' + process.env.NODE_ENV + ')');
});


// app.use(API);

var storage = multer.memoryStorage();
app.use('/graphql', multer({ storage }).single('file'));

app.use('/graphql', graphQLHTTP(req => {
  return ({
      schema: querySchema,
      rootValue: {request: req},
      graphiql: true,
      pretty: true,
  });
}));



app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, '/../frontend/build')));

// (new MyImages()).add('abc.jpeg')
// .then(res => {
  // console.log(res);
// });
//
//testj


