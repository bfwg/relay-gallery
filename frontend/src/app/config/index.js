"use strict";

function getHost() {
  console.log('1234');
  switch(process.env.NODE_ENV) {
    case 'production':
      console.log('production');
      return "http://159.203.31.187";
    default:
      console.log('div');
      return 'http://localhost:3000';
  }
}

const config = {
  SERVER_HOST: getHost(),
};


module.exports = config;
