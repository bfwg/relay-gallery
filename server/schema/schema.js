'use strict';
const GraphQL = require('graphql');
const Relay = require('graphql-relay');

const MyImages = require('../models/MyImages');
const Promise = require("bluebird");



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
    return obj.url ? ImageType : null;
  }
);

var ImageType = new GraphQL.GraphQLObjectType({
  name: 'Image',
  fields: () => ({
    id: Relay.globalIdField('Image'),
    url: {
      type: GraphQL.GraphQLString,
      description: 'Image url',
    }
  }),
  interfaces: [nodeDefinition.nodeInterface],
});


var _connectionDefinitions = Relay.connectionDefinitions({ name: 'Image', nodeType: ImageType });

var ImageConnectionType = _connectionDefinitions.connectionType;
var ImageEdge = _connectionDefinitions.edgeType;

var UserType = new GraphQL.GraphQLObjectType({
  name: 'User',
  description: 'A User',
  fields: () => ({
    id: Relay.globalIdField('User'),
    username: {
      type: GraphQL.GraphQLString,
      description: 'the User name',
      resolve: (_) => {
        console.log(_.viewer);
        return _.viewer;
      }
    },
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



const queryType = new GraphQL.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    User: {
      type: UserType,
      description: 'A User',
      resolve: (_, args, options) => {
        return {viewer: options.rootValue.session || 'Guest'};
      },
    },
    node: nodeDefinition.nodeField,
  }),
});

var imageMutation = Relay.mutationWithClientMutationId({
  name: 'IntroduceImage',
  inputFields: {
    imageName: {
      type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString)
    },
  },
  outputFields: {
    newImageEdge: {
      type: ImageEdge,
      resolve: (payload) => {
        return Promise.all([(new MyImages()).getAll(), (new MyImages()).getById(payload.insertId)])
        .spread((allImages, newImage) => {
          var newImageStr = JSON.stringify(newImage);
          var offset = allImages.reduce((pre, ele, idx) => {
            if (JSON.stringify(ele) === newImageStr)
              return idx;
          }, -1);
          return {
            cursor: offset !== -1 ? Relay.offsetToCursor(offset) : null,
            node: newImage,
          };
        });
      }
    },
    User: {
      type: UserType,
      resolve: () => (new MyImages()).getAll()
    }
  },
  mutateAndGetPayload: (input) => {
    var name = input.imageName;
    return (new MyImages()).add(name)
    .then((id) => {
      return {
        insertId: id,
      };
    });
  }
});


var usernameMutation = Relay.mutationWithClientMutationId({
  name: 'UpdateUsername',
  inputFields: {
    id: {
      type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID)
    },
    username: {
      type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString)
    },
  },
  outputFields: {
    User: {
      type: UserType,
      resolve: (payload) => {
        return {viewer: payload.username };
      },
    }
  },
  mutateAndGetPayload: (input) => {
    var localUserId = Relay.fromGlobalId(input.id).id;
    return {id: localUserId, username: input.username};
  }
});

var mutationType = new GraphQL.GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    introduceImage: imageMutation,
    changeUsername: usernameMutation,
  })
});


module.exports.schema = new GraphQL.GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
