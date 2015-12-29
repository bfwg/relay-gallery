'use strict';

const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;
const graphQLHTTP = require('express-graphql');
const MyImages = require('./models/MyImages');
const User = require('./models/User');
const querySchema = require('./schema/schema').schema;

const API = require('./api');



const app = express();

app.use(API);


app.use('/graphql', graphQLHTTP(() => ({
  schema: querySchema,
  graphiql: true,
  pretty: true,
})));

app.listen(PORT, () => {
  console.log('node ' + process.version + ' listen on port ' + PORT + '(' + process.env.NODE_ENV + ')');
});


console.log(__dirname);
app.use(express.static(path.join(__dirname, 'static')));

// (new MyImages()).add('abc.jpeg')
// .then(res => {
  // console.log(res);
// });
//


