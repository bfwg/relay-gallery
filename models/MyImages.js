'use strict';
const RedisClient = require('./redisClient');

const MyImages = function() {
  const myImages = this;
  myImages.namespace = '1:gallery';
  myImages.IDCountPrefix = 'imageIDCount';
};


MyImages.prototype = RedisClient;

MyImages.prototype.getAll = function() {
  return this.lrangeAsync(this.namespace, -40, -1)
  .then(arr => arr.reverse())
  .map((res) => {
    return JSON.parse(res);
  });

};

MyImages.prototype.getById = function(index) {
  return this.lrangeAsync(this.namespace, -40, -1)
  .then(arr => {
    return arr.reduce((pre, ele) => {
      if (JSON.parse(ele).id === index) {
        return JSON.parse(ele);
      }
      return pre;
    }, null);
  });
};

MyImages.prototype.rewind = function() {
  this.rpop(this.namespace);
  this.decr(this.IDCountPrefix);
};

MyImages.prototype.add = function(imageName) {
  return (
    this.incrAsync(this.IDCountPrefix)
    .then(id => {
      const obj = {};
      obj.id = id;
      obj.url = imageName;
      obj.createTime = Date.now();
      // flag 1 means show
      // for futrue delete purpose
      obj.flag = 1;
      this.rpush(this.namespace, JSON.stringify(obj));
      return id;
    }));
};

MyImages.prototype.peekNextImgID = function() {
  return (
    this.getAsync(this.IDCountPrefix)
    .then(id => {
      return (id + 1) || 1;
    })
  );
};
module.exports = MyImages;
