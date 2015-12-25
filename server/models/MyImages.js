"use strict";
const RedisClient = require('./redisClient');

var MyImages = function() {
  var myImages = this;
  myImages.namespace = 'FanImageStorage';
};


MyImages.prototype = RedisClient;

MyImages.prototype.getAll = function() {
  return this.lrangeAsync(this.namespace, 0, -1);
}

MyImages.prototype.getById = function(index) {
  return this.lindexAsync(this.namespace, index - 1);
}

module.exports = MyImages;
