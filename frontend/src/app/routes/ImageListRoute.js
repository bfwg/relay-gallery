import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    imageList: () => Relay.QL`query { imageList }`,
  };
  static routeName = 'ImageListRoute';
}
