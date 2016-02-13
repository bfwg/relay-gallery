import Relay from 'react-relay';

class ChangeUserStatusMutation extends Relay.Mutation {
  // This mutation declares a dependency on a document's ID
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
      }`,
  };
  // We know that only the document's name can change as a result
  // of this mutation, and specify it here in the fat query.
  getFatQuery() {
    return Relay.QL`
      fragment on UpdateUserStatusPayload {
        User {
          username,
        },
    }
    `;
  }

  getVariables() {
    return {
      userData: this.props.userData,
    };
  }

  getMutation() {
    return Relay.QL`mutation{ changeUserStatus }`;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        User: this.props.user.id,
      },
    }];
  }
  /* ... */
}

module.exports = ChangeUserStatusMutation;
