'use strict';
const config = require('../config');
const redis = require('redis');
const Promise = require('bluebird');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient({
  host: config.store.redis.host,
  port: config.store.redis.port,
});

module.exports = redisClient;
