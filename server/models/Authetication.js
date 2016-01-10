"use strict";
const crypto = require('crypto');

var Authetication = function(secret) {
  this.secret = secret;
  this.algorithm = 'aes-256-ctr';
};

Authetication.prototype.encrypt = function(text) {
  const cipher = crypto.createCipher(this.algorithm, this.secret);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

Authetication.prototype.decrypt = function(text) {
  const decipher = crypto.createDecipher(this.algorithm, this.secret);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};




module.exports = Authetication;
