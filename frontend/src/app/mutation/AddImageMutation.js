import Relay from 'react-relay';

class AddImageMutation extends Relay.Mutation {

  static fragments = {
    images: () => Relay.QL`
      fragment on User {
        id
      }`,
  };

  getMutation() {
    return Relay.QL`mutation{ introduceImage }`;
  }

  getFiles() {
    return {
      file: this.props.file,
    };
  }

  getVariables() {
    return {
      imageName: this.props.file.name,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on IntroduceImagePayload {
        User {
          images(first: 100) {
            edges {
              node {
                url,
              }
            }
          }
        },
        newImageEdge,
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'User',
      parentID: this.props.images.id,
      connectionName: 'images',
      edgeName: 'newImageEdge',
      rangeBehaviors: {
        '': 'append',
        'orderby(oldest)': 'prepend',
      },
    }];
  }

}

module.exports = AddImageMutation;
