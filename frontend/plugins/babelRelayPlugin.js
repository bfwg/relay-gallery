const getBabelRelayPlugin = require('babel-relay-plugin');
const schema = require('../schema/schema.json');

module.exports = getBabelRelayPlugin(schema.data);
