import Relay from 'react-relay';

export default class ChangeUserStatusMutation extends Relay.Mutation {
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
      fragment on UpdateUsernamePayload {
        User {
          username,
        },
    }
    `;
  }

  getVariables() {
    return {
      id: this.props.user.id,
      username: this.props.username,
    };
  }

  getMutation() {
    return Relay.QL`mutation{ changeUsername }`;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      // Correlate the `updatedDocument` field in the response
      // with the DataID of the record we would like updated.
      fieldIDs: {
        User: this.props.user.id,
      },
    }];
  }
  /* ... */
}
