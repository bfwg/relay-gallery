import Relay from 'react-relay';

export default class AddImageMutation extends Relay.Mutation {

  static fragments = {
    images: () => Relay.QL`
      fragment on ImageList {
        id
      }`,
  };

  getMutation() {
    return Relay.QL`mutation{ introduceImage }`;
  }

  getVariables() {
    return {
      imageName: this.props.fileName,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on IntroduceImagePayload {
        imageList {
          images {
            edges {
              node {
                url,
              }
            }
          }
        },
        newImageEdge
      }
    `;
  }

  getConfigs() {
    console.log(this.props);
    return [{
      type: 'RANGE_ADD',
      parentName: 'imageList',
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
