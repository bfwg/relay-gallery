'use strict';
const Helmet = require('react-helmet');
let React = require('react');
const Relay = require('react-relay');

const {Styles, Mixins} = require('material-ui');
const {Colors, Spacing, Transitions, Typography} = Styles;
const {StylePropable, StyleResizable} = Mixins;
import { Link } from 'react-router';

const Whatelse = React.createClass({

  displayName: 'Whatelse',

  mixins: [StylePropable, StyleResizable],


  getStyles() {

    const desktopKeylineIncrement = Spacing.desktopKeylineIncrement;
    const styles = {
      container: {
        width: '100%',
        margin: '0 auto',
        textAlign: 'center',
        background: Colors.grey50,
        marginTop: '0px',
        boxSizing: 'border-box',
        marginBottom: 14,
      },
      p: {
        padding: '0px 10px 10px 10px',
        fontFamily: 'monospace',
        fontSize: '20px',
        letterSpacing: 0,
        wordBreak: 'break-all',
        fontWeight: Typography.fontWeightMedium,
        color: Typography.textDarkBlack,
        textAlign: 'center',
        margin: '0px',
        padding: '0px 20px 10px 20px',
        paddingTop: 19,
        lineHeight: desktopKeylineIncrement - 15 + 'px',
      },
      pWhenMedium: {
        padding: '0px 50px 10px 50px',
      },
      h: {
        fontFamily: 'monospace',
        fontSize: '20px',
        letterSpacing: 0,
        wordBreak: 'break-all',
        fontWeight: Typography.fontWeightMedium,
        color: Typography.textDarkBlack,
        lineHeight: desktopKeylineIncrement - 15 + 'px',
      },
      div1: {
        width: '100%',
        float: 'none',
      },
      div2: {
        marginLeft: 'auto',
      },
      div1WhenMedium: {
        width: '50%',
        float: 'left',
        overflow: 'hidden',
        maxHeight: 500,
      },
      div2WhenMedium: {
        marginLeft: '50%',
        overflow: 'hidden',
        maxHeight: 500,
      },
    };

    if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM) ||
        this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
      styles.div1 = this.mergeStyles(
        styles.div1,
        styles.div1WhenMedium
      );
      styles.div2 = this.mergeStyles(
        styles.div2,
        styles.div2WhenMedium
      );
      styles.p = this.mergeStyles(
        styles.p,
        styles.pWhenMedium
      );
    }

    return styles;
  },
  render() {
    const styles = this.getStyles();
    return (
      <div className="container">
        <div style={styles.container}>
          <Helmet
            title="What else?"
            meta={[
                {'name': 'description', 'content': 'What else about Fan?'},
            ]} />
          <img style={{maxWidth: '100%'}} src="/images/whatelse.png"/>
          <p style={styles.p}>Ahh! I can't believe you found this page.</p>
          <p style={styles.p}>Here is the secret: Fan loves all kinds of <span style={{color: 'brown'}}>Mocha</span>, all kinds!</p>
          <div style={styles.div1}>
            <p style={styles.h}>Fan &#60;3 this</p>
            <img style={{maxWidth: '80%'}} src="/images/mocha.jpg" />
          </div>
          <div style={styles.div2}>
            <p style={styles.h}> and this!</p>
            <img style={{maxWidth: '80%'}} src="/images/dogmocha.jpg" />
          </div>
          <p style={styles.p}>and YES, Fan named his dog <span style={{color: 'brown'}}>"Mocha"</span>.</p>
          <p style={styles.p}><Link to="/">Back to gallery?</Link></p>
        </div>
      </div>

    );
  },

});
module.exports = Whatelse;
