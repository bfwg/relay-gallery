'use strict';
let React = require('react');
const Relay = require('react-relay');

const Test = React.createClass({

  displayName: 'Test',

  componentDidMount() {
  },

  render() {
    return (
      <div style={{marginTop: 500}}>
        asdlfajsdkflasdf
      </div>
    );
  },

});

module.exports = Relay.createContainer(Test, {
  fragments: {
    User: () => Relay.QL`
      fragment on User {
        username,
        images(first: 30) {
          edges {
            node {
              id,
              url,
              createTime,
            }
          }
        }
      }
    `,
  },
});
