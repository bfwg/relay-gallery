"use strict";
const React = require('react');
const Relay = require('react-relay');
const Dialog = require('material-ui/lib/dialog');
const ThemeManager = require('material-ui/lib/styles/theme-manager');
const Colors = require('material-ui/lib/styles/colors');
const Dropzone = require('react-dropzone');
const request = require('superagent');
const AddImageMutation  = require('../mutation/AddImageMutation');
const ChangeUserStatusMutation  = require('../mutation/ChangeUserStatusMutation');
const {RaisedButton, Mixins} = require('material-ui');
const {StylePropable, StyleResizable} = Mixins;
const {FullWidthSection, MyCard} = require('../helper');
const MyRawTheme = require('../helper/myRawTheme');
const Login = require('./Login');
const {SERVER_HOST} = require('../config');

const Main = React.createClass({

  mixins: [StylePropable, StyleResizable],

  getInitialState () {
    return {
      loginDialogOpenFlag: false,
      muiTheme: ThemeManager.getMuiTheme(MyRawTheme),
      files: null,
    };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object,
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

  onDrop: function (files) {
    console.log(arguments.length);
    if (this.props.User.username === 'Guest') {
      this.setState({
        loginDialogOpenFlag: true,
      });
    } else {
      console.log(files);
      let req = request.post('http://localhost:3000/upload');
      files.forEach((file)=> {
        req.attach(file.type, file, file.name);
      });
      req.end(() => {
        files.forEach((file)=> {
          console.log(file.name, 'upload finished');
          console.log(this.props);
          let fileName = file.name;
          Relay.Store.update(
            new AddImageMutation({
              fileName,
              images: this.props.User,
          })
        );
        });
      });
    }
  },

  onSubmitLogin: function(username) {
    this.setState({
      loginDialogOpenFlag: false,
    });
    console.log('submit', username);
    Relay.Store.update(
      new ChangeUserStatusMutation({
        username,
        user: this.props.User,
    }));
    //not opening
    this.refs.dropzone.open();
  },

  onLoginCanel: function() {
    this.setState({
      loginDialogOpenFlag: false,
    });
  },

  onUpload: function() {
    if (this.props.User.username === 'Guest') {
      this.setState({
        loginDialogOpenFlag: true,
      });
    } else {
      this.refs.dropzone.open();
    }
  },

  render() {

    let styles = this.getStyles();
    let standardActions = [
      { text: 'Okay' },
    ];
    console.log(this.props.User);

    return (
      <div style={styles.containerStyle}>
        <Dialog
          open={this.state.loginDialogOpenFlag}
          contentStyle={{width: 430, textAlign: 'center'}}
          ref="loginDialog"
          onRequestClose={this.onLoginCanel}>
          <Login
            submit={this.onSubmitLogin.bind(this)}
            onCancel={this.onLoginCanel} />
        </Dialog>
        <FullWidthSection useContent={true} style={{textAlign: 'center'}}>
          <MyCard
            style={styles.bigPic}
            heading="I'm Fan, I make things for the web."
            img="images/me.jpg"/>
        </FullWidthSection>

        <FullWidthSection useContent={true} contentStyle={{textAlign: 'center'}} >
          {this.props.User.images.edges.map((ele, idx) => (
            <MyCard
              key={idx}
              style={styles.smallPic}
              imgStyle={{height: 'inherit'}}
              img={`${SERVER_HOST}/images/` + ele.node.url} />
          ))}

          <Dropzone disableClick={true} style={styles.addImage} ref="dropzone" onDrop={this.onDrop.bind(this)}>
            <MyCard
              onClick={this.onUpload.bind(this)}
              style={styles.smallPic}
              imgStyle={{height: '180px'}}
              img="images/upload.png"/>
          </Dropzone>
        </FullWidthSection>
      </div>
    );
  },

  getStyles() {
    let styles = {
      containerStyle: {
        textAlign: 'center',
        // paddingTop: '50px',
      },
      smallPic: {
        width: '180px',
        height: '180px',
        float: 'left',
        marginRight: '5px',
      },
      bigPic: {
        maxWidth: '400px',
        marginRight: 'auto',
      },
      addImage: {
        float: 'none',
      },
      addImageWhenMedium: {
        float: 'left',
      },
    };

    if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM) ||
        this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
      styles.addImage = this.mergeAndPrefix(
        styles.addImage,
        styles.addImageWhenMediu
      );
    }
    return styles;
  },


  _handleTouchTap() {
    let username = 'testtest';
    // Relay.store.update(
      // new Changeuserstatusmutation({
        // username,
        // user: this.props.user,
    // }));
  },

});

module.exports = Relay.createContainer(Main, {

  fragments: {
    User: () => Relay.QL`
      fragment on User {
        username,
        images(first: 1000) {
          edges {
            node {
              url,
            }
          }
        }
      ${AddImageMutation.getFragment('images')},
      ${ChangeUserStatusMutation.getFragment('user')},
      }
    `,
  },
});
