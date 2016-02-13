import Relay from 'react-relay';

class UserRoute extends Relay.Route {
  static queries = {
    User: () => Relay.QL`query { User }`,
  };
  static routeName = 'ImageListRoute';
}
module.exports = UserRoute;
