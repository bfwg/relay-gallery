"use strict";
const gm = require('gm');
const fs = require('fs');
// const ExifImage = require('exif').ExifImage;
const MyImages = require('../models/MyImages');

// path is the path to your image
module.exports = function(buffer, path, filename, resolve) {


    // try {
      // new ExifImage({ image : buffer }, function (error, exifData) {
      // if (error)
        // console.log('Error: '+error.message);
      // else {
        // console.log(exifData); // Do something with your data!
      // }
      // });
    // } catch (error) {
      // console.log('Error: ' + error.message);
    // }

  gm(buffer, filename)
  .autoOrient()
  .write(path, function (err) {
    if (!err) {
      console.log('File saved.');
      resolve();
    } else {
      console.log(err);
      (new MyImages()).rewind();
      throw err;
    }
  });


};
