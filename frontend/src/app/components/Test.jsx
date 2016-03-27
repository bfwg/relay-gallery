'use strict';
let React = require('react');
const Relay = require('react-relay');
let { SvgIcon } = require('material-ui');
let { PureRenderMixin } = require('react-addons-pure-render-mixin');

const Test = React.createClass({

  displayName: 'Test',

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
