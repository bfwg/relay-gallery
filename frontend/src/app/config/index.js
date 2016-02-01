"use strict";

function getHost() {
  switch(process.env.NODE_ENV) {
    case 'production':
      return 'http://159.203.31.187';
    default:
      return 'http://localhost:3000';
  }
}

var config = {
  SERVER_HOST: getHost(),
};


module.exports = config;
