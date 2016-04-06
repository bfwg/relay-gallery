const React = require('react');
const {Colors} = require('material-ui/lib/styles');
const {GitHubIcon} = require('../svgIcons');
const {Mixins} = require('material-ui');
const {StylePropable} = Mixins;
const Separator = require('./Separator');


const Main = React.createClass({

  mixins: [StylePropable],

  propTypes: {
    children: React.PropTypes.node,
  },

  getStyles() {
    const styles = {
      footer: {
        paddingTop: '10px',
        paddingBottom: '10px',
        textAlign: 'center',
      },
      p: {
        padding: 0,
        color: Colors.grey600,
      },
    };

    return styles;
  },

  render() {

    let footerIconSize = 38;
    let styles = this.getStyles();
    return (
      <div>
        {this.props.children}
        <Separator />
        <div style={styles.footer}>
          <p style={this.prepareStyles(styles.p)}>
            {'Hand crafted with love by Fan Jin'}
          </p>
          <a href="https://github.com/bfwg">
            <GitHubIcon style={{
              color: Colors.grey400,
              width: footerIconSize,
              height: footerIconSize,
            }}/>
          </a>
        </div>
      </div>
    );
  },

});

module.exports = Main;
