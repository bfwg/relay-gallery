var env = process.env.NODE_ENV || 'development';

module.exports = {
  store: require('./db-' + env + '.json'),
  // onepunch
  tokenSecret: 'b25lcHVuY2g=',
};
