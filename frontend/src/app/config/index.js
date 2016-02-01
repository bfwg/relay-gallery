"use strict";

function getHost() {
  switch(process.env.NODE_ENV) {
    case 'production':
      return 'http://localhost:3000';
    default:
      return 'http://localhost';
  }
}

var config = {
  SERVER_HOST: getHost(),
};


module.exports = config;
