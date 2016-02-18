'use strict';
const RedisClient = require('./redisClient');

var User = function() {};


User.prototype = RedisClient;

User.prototype.login = function(email, pass) {
  return this.getAsync(email)
  .then(user => {
    if (!user || pass !== JSON.parse(user).password) return null;
    return 'success';
    //return issued token
  });
  //check email pass
};



module.exports = User;
