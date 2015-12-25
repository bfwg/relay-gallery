'use strict';

const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();

const MyImages = require('./models/MyImages');


const server = app.listen(PORT, () => {
  console.log('node ' + process.version + ' listen on port ' + PORT + '(' + process.env.NODE_ENV + ')');
});

var obj = {url: 'abc'};
console.log(JSON.stringify(obj));
(new MyImages).getById(2)
.then(res => {
  console.log(JSON.parse(res).url);
});

console.log(__dirname);
app.use(express.static(path.join(__dirname, 'static')));
