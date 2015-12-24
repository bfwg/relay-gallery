"use strict";
const React = require('react');
const RaisedButton = require('material-ui/lib/raised-button');
const Dialog = require('material-ui/lib/dialog');
const ThemeManager = require('material-ui/lib/styles/theme-manager');
const LightRawTheme = require('material-ui/lib/styles/raw-themes/light-raw-theme');
const Colors = require('material-ui/lib/styles/colors');
const {FullWidthSection, MyCard} = require('../helper');
const MyRawTheme = require('../helper/myRawTheme');

const Main = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getInitialState () {
    return {
      muiTheme: ThemeManager.getMuiTheme(MyRawTheme),
    };
  },

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  componentWillMount() {
    let newMuiTheme = ThemeManager.modifyRawThemePalette(this.state.muiTheme, {
      accent1Color: Colors.deepOrange500,
    });

    this.setState({muiTheme: newMuiTheme});
  },

  render() {

    let styles = {
      containerStyle: {
        textAlign: 'center',
        // paddingTop: '50px',
      },
      smallPic: {
        maxWidth: '236px',
        float: 'left',
      },
      bigPic: {
        maxWidth: '400px',
      },
    };

    let standardActions = [
      { text: 'Okay' },
    ];

    return (
      <div style={styles.containerStyle}>
        <Dialog
          title="Super Secret Password"
          actions={standardActions}
          ref="superSecretPasswordDialog">
          1-2-3-4-5
        </Dialog>
        <FullWidthSection useContent={true} style={{textAlign: 'center'}}>
          <MyCard
            style={styles.bigPic}
            heading="I'm Fan, I make things for the web."
            img="images/me.jpg"/>
        </FullWidthSection>
        <FullWidthSection useContent={true} contentStyle={{textAlign: 'center'}} >
          <MyCard
            style={styles.smallPic}
            img="images/me.jpg"/>
          <MyCard
            style={styles.smallPic}
            img="images/me.jpg"/>
          <MyCard
            style={styles.smallPic}
            img="images/me.jpg"/>
          <MyCard
            style={styles.smallPic}
            img="images/me.jpg"/>
          <MyCard
            style={styles.smallPic}
            img="images/me.jpg"/>
          <MyCard
            style={styles.smallPic}
            img="images/me.jpg"/>
          <MyCard
            style={styles.smallPic}
            img="images/me.jpg"/>
        </FullWidthSection>

      </div>
    );
  },

  _handleTouchTap() {
    // this.refs.superSecretPasswordDialog.show();
  },

});

module.exports = Main;
