'use strict';
const GraphQL = require('graphql');
const Relay = require('graphql-relay');
const User = require('../models/User');
const MyImages = require('../models/MyImages');
const Promise = require("bluebird");
const fs = require('fs');
const uploadAuth = require('../middleware/uploadAuth');



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
    },
    createTime: {
      type: GraphQL.GraphQLString,
      description: 'The date image is created',
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
      resolve: (user) => {
        // console.log(user.username);
        return user.username;
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
      resolve: (rootValue) => {
        if (rootValue.request.session && rootValue.request.session.username)
          return {username: rootValue.request.session.username};
        else
          return {username: 'Guest'};
      },
    },
    node: nodeDefinition.nodeField,
  }),
});

var imageMutation = Relay.mutationWithClientMutationId({
  name: 'IntroduceImage',
  inputFields: {
    imageName: {
      type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
    },
  },
  outputFields: {
    newImageEdge: {
      type: ImageEdge,
      resolve: (payload, args, options) => {
        //test first file
        var file = options.rootValue.request.file;

        var filename = file.originalname;
        // var filetype = file.mimetype;
        // console.log("Uploading: " + filename + " type: " + filetype);
        //check if user has the Authtifcation to upload
        if (!uploadAuth(options.rootValue.request)) {
          (new MyImages()).rewind();
          throw Error('Upload Access Denined');
        }

        fs.writeFile(__dirname + '/../static/images/' + filename, file.buffer, function (err) {
          //if somehow the file upload files we
          //remove the img from database
          if (err) {
            (new MyImages()).rewind();
            throw err;
          }
          // console.log('File saved.');
        });

        //prepare for update view
        return Promise.all(
          [(new MyImages()).getAll(),
            (new MyImages()).getById(payload.insertId)])
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
    //break the names to array.
    return (new MyImages()).add(input.imageName)
    .then((id) => {
      return {
        insertId: id,
      };
    });
  },
});


var userStatucMutation = Relay.mutationWithClientMutationId({
  name: 'UpdateUserStatus',
  inputFields: {
    userData: {
      type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString)
    },
  },
  outputFields: {
    User: {
      type: UserType,
      resolve: (payload, args, options) => {
        //if pass auth put username into session
        console.log(payload);
        // if (payload.username) {
          options.rootValue.request.session.username = payload.username;
          return {username: payload.username};
        // } else {
          // throw Error('Incorrect Username or Password');
        // }
      },
    }
  },
  mutateAndGetPayload: (input) => {
    let userDataArray = input.userData.split(':');
    let username = userDataArray[0];
    let pass = userDataArray[1];
    return (new User()).login(username, pass)
    .then(response => {
      if (response) {
        return {username: username};
      } else {
        throw Error('Incorrect Username or Password');
      }
    });
  }
});

var mutationType = new GraphQL.GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    introduceImage: imageMutation,
    changeUserStatus: userStatucMutation,
  })
});


module.exports.schema = new GraphQL.GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
