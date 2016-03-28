'use strict';
const GraphQL = require('graphql');
const Relay = require('graphql-relay');
const User = require('../models/User');
const myImages = require('../models/myImages');
const Promise = require('bluebird');
const uploadAuth = require('../middleware/uploadAuth');
const md5 = require('md5');
const uploadFile = require('../models/uploadImage');



const nodeDefinition = Relay.nodeDefinitions(
  (globalId) => {
    const target = Relay.fromGlobalId(globalId);
    if (target.type === 'Image') {
      return (new myImages()).getById(target.id);
    } else {
      return null;
    }
  },
  (obj) => {
    return obj.url ? ImageType : null;
  }
);

const ImageType = new GraphQL.GraphQLObjectType({
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
    },
  }),
  interfaces: [nodeDefinition.nodeInterface],
});


const _connectionDefinitions = Relay.connectionDefinitions({ name: 'Image', nodeType: ImageType });

const ImageConnectionType = _connectionDefinitions.connectionType;
const ImageEdge = _connectionDefinitions.edgeType;

const UserType = new GraphQL.GraphQLObjectType({
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
      },
    },
    images: {
      type: ImageConnectionType,
      description: 'A collection of images',
      args: Relay.connectionArgs,
      resolve: (_, args) => Relay.connectionFromPromisedArray(
        (new myImages()).getAll(),
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
        if (rootValue.request.session && rootValue.request.session.username) {
          return {username: rootValue.request.session.username};
        } else {
          return {username: 'Guest'};
        }
      },
    },
    node: nodeDefinition.nodeField,
  }),
});

const imageMutation = Relay.mutationWithClientMutationId({
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
        const file = options.rootValue.request.file;

        const filename = payload.imgNmae;
        const filetype = file.mimetype;
        const filePath = __dirname + '/../static/images/' + filename;
        console.log('Uploading: ' + filename + ' type: ' + filetype);
        //check if user has the Authtifcation to upload
        if (!uploadAuth(options.rootValue.request)) {
          (new myImages()).rewind();
          console.log('Upload Access Denined');
          throw Error('Upload Access Denined');
        }

        //if no errors we need to make usre
        //the orientataion is correct
        //iphone images has orientataion problems



        //prepare for update image
        return uploadFile(file.buffer, filePath, filename)
        .then(() => {
          /* Find the offset for new edge*/
          return Promise.all(
            [(new myImages()).getAll(),
              (new myImages()).getById(payload.insertId)])
          .spread((allImages, newImage) => {
            const newImageStr = JSON.stringify(newImage);
            /* If edge is in list return index */
            const offset = allImages.reduce((pre, ele, idx) => {
              if (JSON.stringify(ele) === newImageStr) {
                return idx;
              }
              return pre;
            }, -1);

            return {
              cursor: offset !== -1 ? Relay.offsetToCursor(offset) : null,
              node: newImage,
            };
          });
        });
      },
    },
    User: {
      type: UserType,
      resolve: () => (new myImages()).getAll(),
    },
  },
  mutateAndGetPayload: (input) => {
    //break the names to array.

    let imageName = input.imageName.substring(0, input.imageName.lastIndexOf('.'));
    const mimeType = input.imageName.substring(input.imageName.lastIndexOf('.'));
    // console.log({imageName});
    // console.log({mimeType});

    //find next id for hash
    return (new myImages())
    .peekNextImgID(input.imageName)
    .then(id => {
      imageName = md5(imageName + id) + mimeType || '.jpeg';
      // console.log(imageName);
      // insert image
      return (new myImages())
      .add(imageName);
    })
    .then(id => {
      return {
        insertId: id,
        imgNmae: imageName,
      };
    });
  },
});


/* User Auth */
const userStatucMutation = Relay.mutationWithClientMutationId({
  name: 'UpdateUserStatus',
  inputFields: {
    userData: {
      type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
    },
  },
  outputFields: {
    User: {
      type: UserType,
      resolve: (payload, args, options) => {
        //if pass auth put username into session
        options.rootValue.request.session.username = payload.username;
        return {username: payload.username};
      },
    },
  },

  mutateAndGetPayload: (input) => {
    const userDataArray = input.userData.split(':');
    const username = userDataArray[0];
    const pass = userDataArray[1];
    return (new User()).login(username, pass)
    .then(response => {
      if (response) {
        return {username: username};
      } else {
        throw Error('Incorrect Username or Password');
      }
    });
  },
});

const mutationType = new GraphQL.GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    introduceImage: imageMutation,
    changeUserStatus: userStatucMutation,
  }),
});


module.exports.schema = new GraphQL.GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
