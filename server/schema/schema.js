'use strict';
const Promise = require("bluebird");
const GraphQL = require('graphql');
const Relay = require('graphql-relay');

const MyImages = require('../models/MyImages');

const nodeDefinition = Relay.nodeDefinitions(
  (globalId) => {
    const target = Relay.fromGlobalId(globalId);
    if (target.type === 'Image') {
      return (new MyImages()).getById(target.id);
    } else {
      return null;
    }
  },
  (obj) => {
    return JSON.parse(obj).url ? ImageType : null;
  }
);

var ImageType = new GraphQL.GraphQLObjectType({
  name: 'Image',
  description: 'A Image',
  fields: () => ({
    id: Relay.globalIdField('Image'),
    url: {
      type: GraphQL.GraphQLString,
      description: 'Image url',
    }
  }),
  interfaces: [nodeDefinition.nodeInterface],
});


var ImageListType = new GraphQL.GraphQLObjectType({
  name: 'ImageList',
  description: 'A list of images',
  fields: () => ({
    id: Relay.globalIdField('ImageList'),
    images: {
      type: ImageConnectionType,
      description: 'A collection of images',
      args: Relay.connectionArgs,
      resolve: (_, args) => Relay.connectionFromPromisedArray(
        (new MyImages()).getAll(),
        args
      ),
    },
  }),
  interfaces: [nodeDefinition.nodeInterface],
});

const ImageConnectionType =
  Relay.connectionDefinitions({name: 'Image', nodeType: ImageType});


const queryType = new GraphQL.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    imageList: {
      type: ImageListType,
      description: 'List of images',
      resolve: () => ({type: 'image'}),
    },
    node: nodeDefinition.nodeField,
  }),
});

module.exports.schema = new GraphQL.GraphQLSchema({
  query: queryType,
});
