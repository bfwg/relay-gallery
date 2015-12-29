"use strict";
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const busboy = require('connect-busboy');
const fs = require('fs');
const User = require('../models/User');


app.use(cors());
app.use(busboy());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.post('/upload', (req, res) => {
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename + " type: " + fieldname);
    fstream = fs.createWriteStream(__dirname + '/../static/images/' + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
      res.send('Image upload complete');
      // res.redirect('back');
    });
  });
});

app.post('/login', (req, res) => {
  let email = req.body.email;
  let pass = req.body.password;
  (new User()).login(email, pass)
  .then(response => {
    response ? res.send('ok') : res.status(503).end();
  });
});


module.exports = app;
