'use strict';
let React = require('react');
const Relay = require('react-relay');

const {Styles} = require('material-ui');
const {Colors, Spacing, Transitions, Typography} = Styles;

const Whatelse = React.createClass({

  displayName: 'Whatelse',

  getStyles() {

    const desktopKeylineIncrement = Spacing.desktopKeylineIncrement;
    const styles = {
      text: {
        fontFamily: 'monospace',
        fontSize: '20px',
        letterSpacing: 0,
        fontWeight: Typography.fontWeightMedium,
        color: Typography.textDarkBlack,
        backgroundColor: Colors.grey50,
        textAlign: 'center',
        margin: '0px',
        padding: '0px 10px 10px 10px',
        paddingTop: 19,
        lineHeight: desktopKeylineIncrement - 15 + 'px',
      },
    };

    return styles;
  },
  render() {
    const styles = this.getStyles();
    return (
      <div style={{marginTop: 500}}>
        <p style={styles.text}>asdlfajsdkflasdf</p>
      </div>
    );
  },

});
module.exports = Whatelse;
// module.exports = Relay.createContainer(Test, {
  // fragments: {
    // User: () => Relay.QL`
      // fragment on User {
        // username,
        // images(first: 30) {
          // edges {
            // node {
              // id,
              // url,
              // createTime,
            // }
          // }
        // }
      // }
    // `,
  // },
// });
