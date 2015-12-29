import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    User: () => Relay.QL`query { User }`,
  };
  static routeName = 'ImageListRoute';
}
