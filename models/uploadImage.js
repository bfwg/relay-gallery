'use strict';
const gm = require('gm').subClass({ imageMagick: true });;
const Promise = require('bluebird');
Promise.promisifyAll(gm.prototype);

const fs = require('fs');
// const ExifImage = require('exif').ExifImage;
const MyImages = require('../models/MyImages');

// path is the path to your image
module.exports = function(buffer, path, filename) {


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

  return gm(buffer, filename)
  .autoOrient()
  .writeAsync(path)
  .then(() => {
    console.log('File saved.');
  })
  .catch(err => {
    console.log(err);
    (new MyImages()).rewind();
    throw err;
  });


};
