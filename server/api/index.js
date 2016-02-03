"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');
const fs = require('fs');
const User = require('../models/User');
const uploadAuth = require('../middleware/uploadAuth');


const app = express();

app.use(busboy());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.post('/upload', uploadAuth, (req, res) => {
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename + " type: " + fieldname);
    console.log("By", req.session.username);
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
    if (response) {
      // res.cookie('mp', email, { expires: new Date(Date.now() + 900000), httpOnly: true });
      req.session.username = email;
      res.send(email);
    } else {
      res.status(503).send('Incorrect Username or Password').end();
    }
  });
});


module.exports = app;
