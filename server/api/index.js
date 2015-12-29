"use strict";
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const busboy = require('connect-busboy');
const fs = require('fs');

app.use(cors());
app.use(busboy());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.post('/upload', (req, res) => {
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename + "type: " + fieldname);
    fstream = fs.createWriteStream(__dirname + '/../static/images/' + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
      res.send('Image upload complete');
      // res.redirect('back');
    });
  });
});

app.post('/login', (req, res) => {
  console.log(req.body);
  let email = req.body.email;
  let pass = req.body.password;
  (new User()).login(email, pass)
  .then(res => {
    res.send(res ? 'OK' : 'unauthorized token');
  });
});


module.exports = app;
