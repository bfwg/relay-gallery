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
const {IconButton, Mixins, Styles} = require('material-ui');
const {Spacing} = Styles;
const {StylePropable, StyleResizable} = Mixins;
const {FullWidthSection, MyCard, MyRawTheme} = require('../helper');
const {GitHubIcon, FaceBook, Linkedin} = require('../svgIcons');
const Login = require('./Login');
const {SERVER_HOST} = require('../config');


Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(`${SERVER_HOST}/graphql`, {
    credentials: 'same-origin',
  })
);

const Main = React.createClass({

  mixins: [StylePropable, StyleResizable],

  getInitialState () {
    return {
      loginDialogOpenFlag: false,
      muiTheme: ThemeManager.getMuiTheme(MyRawTheme),
      files: null,
      selectedImageIdx: null,
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
      // let req = request.post(`${SERVER_HOST}/upload`);
      // files.forEach((file)=> {
        // req.attach(file.type, file, file.name);
      // });
      // req.end(() => {
        // files.forEach((file)=> {
          // console.log(file.name, 'upload finished');
          // console.log(this.props);
          // let fileName = file.name;
          // Relay.Store.commitUpdate(
            // new AddImageMutation({
              // fileName,
              // images: this.props.User,
          // })
        // );
        // });
      // });
      files.forEach((file)=> {
        Relay.Store.commitUpdate(
          new AddImageMutation({
            file,
            images: this.props.User,
          })
        );
      });
    }
  },

  onSubmitLogin: function(username) {
    this.setState({
      loginDialogOpenFlag: false,
    });
    Relay.Store.commitUpdate(
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

  _getSeparator: function() {
    let styles = this.getStyles();
    return (
      <FullWidthSection useContent={false} style={this.mergeStyles(
                  styles.imgContainer, {
                    paddingTop: '0px',
                    paddingBottom: '0px',
                })}>
        <hr/>
      </FullWidthSection>
    );
  },

  _getLinkIconButtonGroup: function() {
    let styles = this.getStyles();
    return (
      <div>
        <IconButton
          iconStyle={styles.icon}
          style={styles.iconStyle}
          href="https://www.facebook.com/people/Fan-Jin/100008957509461"
          linkButton={true}
          touch={true} >
          <FaceBook/>
        </IconButton>
        <IconButton
          iconStyle={styles.icon}
          href="https://github.com/bfwg"
          linkButton={true}
          style={styles.iconStyle}
          touch={true} >
          <GitHubIcon/>
        </IconButton>
        <IconButton
          iconStyle={styles.icon}
          style={styles.iconStyle}
          href="https://ca.linkedin.com/in/fan-jin-a65b03a0"
          linkButton={true}
          touch={true} >
          <Linkedin/>
        </IconButton>
      </div>
    );

  },

  render() {

    let styles = this.getStyles();
    let myAvatar = "images/me.jpg";
    let myTitle = "Hi, My name is <span style='color: purple;'>Fan Jin</span> I make things for the web and designs awesome user experiences that enrich people's lives";
    let footerIconSize = 38;

    return (
      <div style={styles.containerStyle}>
        <Dialog
          open={this.state.loginDialogOpenFlag}
          contentStyle={{
            maxWidth: 430,
            width: '100%',
            textAlign: 'center',
          }}
          onRequestClose={this.onLoginCanel}
          underlineShow={false}
          autoScrollBodyContent={true}>
          <Login
            submit={this.onSubmitLogin}
            onCancel={this.onLoginCanel} />
        </Dialog>

        <FullWidthSection style={styles.avatarContainer} useContent={false}>
          <MyCard
            style={styles.bigPic}
            imgStyle={{width: '100%', maxWidth: '420px'}}
            onClick={() => {
              window.location.replace('https://github.com/bfwg/mypage');
            }}
            heading={myTitle}
            img={myAvatar} />
            {this._getLinkIconButtonGroup()}
        </FullWidthSection>

        {this._getSeparator()}

        <FullWidthSection style={styles.imgContainer}>
          <div>
            <h1 style={{fontFamily: 'Monospace'}}> Me and More! </h1>
            <img src="images/gallery.png" />
          </div>
          {this.props.User.images.edges.map((ele, idx) => {
            return (
            <MyCard
              key={idx}
              style={styles.smallPic}
              imgStyle={{maxHeight: '100%'}}
              lineHeight={styles.imageWH}
              imgIdx={idx}
              imgList={this.props.User.images.edges}
              img={`${SERVER_HOST}/images/` + ele.node.url} />
            );
          })}

          <Dropzone disableClick={true} style={styles.addImage} ref="dropzone" onDrop={this.onDrop}>
            <MyCard
              onClick={this.onUpload}
              style={styles.smallPic}
              imgStyle={{maxHeight: '100%'}}
              lineHeight={styles.imageWH}
              img="images/upload.png"/>
          </Dropzone>
        </FullWidthSection>

        {this._getSeparator()}

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

  getStyles() {
    let iconSize = 48;
    let windowWidth = window.innerWidth - 16;
    let imageMargin = 6;
    let imageWH;
    let imageContainerPadding = Spacing.desktopGutter * 4;
    if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM) ||
        this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
        imageWH = 200;
    } else {
        imageContainerPadding = 0;
        imageWH = windowWidth / 2 - imageMargin * 2;
    }
    let imgContainerWidth = windowWidth - ((windowWidth - imageContainerPadding * 2) % (imageWH + imageMargin * 2));
    let styles = {
      icon: {
        width: iconSize + 'px',
        height: iconSize + 'px',
      },
      iconStyle : {
        width: iconSize * 2 + 'px',
        height: iconSize * 2 + 'px',
        padding: iconSize / 2 + 'px',
      },
      containerStyle: {
        textAlign: 'center',
        // paddingTop: '50px',
      },
      avatarContainer: {
        padding: '0px 0px 48px 0px !important',
      },
      avatarContainerWhenMedium: {
        padding: '24px',
        paddingTop: '48px',
      },
      imgContainer: {
        paddingRight: imageContainerPadding,
        paddingLeft: imageContainerPadding,
        width: imgContainerWidth,
        marginLeft: (windowWidth - imgContainerWidth) / 2,
      },
      smallPic: {
        float: 'left',
        width: imageWH + 'px',
        height: imageWH + 'px',
        lineHeight: imageWH + 'px',
        marginLeft: imageMargin + 'px',
        marginRight: imageMargin + 'px',
      },
      bigPic: {
        width: '100%',
        maxWidth: '600px',
        marginRight: 'auto',
        padding: '0px',
      },
      bigPicWhenMedium: {
        width: '33%',
        maxWidth: '420px',
      },
      addImage: {
        float: 'none',
      },
      addImageWhenMedium: {
        float: 'left',
      },
      footer: {
        paddingTop: '10px',
        paddingBottom: '10px',
        textAlign: 'center',
      },
      p: {
        padding: 0,
        color: Colors.grey600,
      },
      a: {
        color: Colors.darkWhite,
      },
    };


    if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM) ||
        this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
      styles.addImage = this.mergeStyles(
        styles.addImage,
        styles.addImageWhenMedium
      );
      styles.bigPic = this.mergeStyles(
        styles.bigPic,
        styles.bigPicWhenMedium
      );
      styles.avatarContainer = this.mergeStyles(
        styles.avatarContainer,
        styles.avatarContainerWhenMedium
      );

    }
    return styles;
  },


  _handleTouchTap() {
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
              createTime,
            }
          }
        }
      ${AddImageMutation.getFragment('images')},
      ${ChangeUserStatusMutation.getFragment('user')},
      }
    `,
  },
});
