var env = process.env.NODE_ENV || 'development';

module.exports = {
  store: require('./db-' + env + '.json'),
  // birdking
  tokenSecret: '8432ab7a78980b7287b313ffc9746dbc',
};
