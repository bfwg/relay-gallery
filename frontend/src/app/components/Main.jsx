const React = require('react');
const Relay = require('react-relay');
const {Colors, getMuiTheme} = require('material-ui/lib/styles');
const ChangeUserStatusMutation  = require('../mutation/ChangeUserStatusMutation');
const {Dialog, IconButton, Mixins, Styles} = require('material-ui');
const {Spacing} = Styles;
const {StylePropable, StyleResizable} = Mixins;
const {FullWidthSection, MyRawTheme} = require('../helper');
const {GitHubIcon, FaceBook, Linkedin} = require('../svgIcons');
const Login = require('./Login');
const AddImageMutation  = require('../mutation/AddImageMutation');
const Dropzone = require('react-dropzone');
const MyCard = require('./MyCard');
const {SERVER_HOST} = require('../config');


Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(`${SERVER_HOST}/graphql`, {
    credentials: 'same-origin',
  })
);

const Main = React.createClass({

  displayName: 'Main',

  propTypes: {
    User: React.PropTypes.object,
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object,
    imageList: React.PropTypes.array,
  },


  mixins: [StylePropable, StyleResizable],

  getInitialState () {
    return {
      muiTheme: getMuiTheme(),
      files: null,
      selectedImageIdx: null,
      loginDialogOpenFlag: false,
      loginError: '',
      loginPending: false,
    };
  },

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
      imageList: this.props.User.images.edges,
    };
  },

  componentWillMount() {
    this.setState({
      muiTheme: this.state.muiTheme,
    });
  },

  onDrop: function (files) {
    if (this.props.User.username === 'Guest') {
      this.setState({
        loginDialogOpenFlag: true,
      });
    } else {
      let onSuccess = () => {
        console.log('Mutation successful!');
      };
      let onFailure = (transaction) => {
        let error = transaction.getError().source.errors[0].message || new Error('Mutation failed.');
        console.log(error);
      };
      files.forEach((file)=> {
        Relay.Store.commitUpdate(
          new AddImageMutation({
            file,
            images: this.props.User,
          }),
          {onSuccess, onFailure}
        );
      });
    }
  },

  onSubmitLogin: function(userData) {

    this.setState({
      loginPending: true,
    });

    let onSuccess = () => {
      this.setState({
        loginError: '',
        loginPending: false,
        loginDialogOpenFlag: false,
      });
      this.refs.dropzone.open();
      console.log('Login successful!');
    };

    let onFailure = (transaction) => {
      let error = transaction.getError().source.errors[0].message || new Error('Mutation failed.');
      console.log(transaction.getError().source.errors[0].message);
      this.setState({
        loginError: error,
        loginPending: false,
      });
    };

    Relay.Store.commitUpdate(
      new ChangeUserStatusMutation({
        userData,
        user: this.props.User,
      }),
      {onSuccess, onFailure}
    );
  },

  onLoginCanel: function() {
    this.setState({
      loginDialogOpenFlag: false,
      loginPending: false,
      loginError: '',
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

  _getLoginDialog: function() {
    return (
        <Dialog
          open={this.state.loginDialogOpenFlag}
          contentStyle={{
            maxWidth: 430,
            width: '100%',
            textAlign: 'center',
          }}
          onRequestClose={this.onLoginCanel}
          autoScrollBodyContent={true}>
          <Login
            pending={this.state.loginPending}
            error={this.state.loginError}
            submit={this.onSubmitLogin}
            onCancel={this.onLoginCanel} />
        </Dialog>

    );
  },

  _getAvatar: function() {
    let styles = this.getStyles();
    let myAvatar = `${SERVER_HOST}/images/me.jpg`;
    /* I have no idea why do I have to give this array a key
      Issue: https://github.com/facebook/react/issues/6038
      Put 6666 for now  */
    let myTitle = ["Hi, My name is ",
      <span key={6666} style={{color: 'purple'}}>Fan Jin</span>,
        ". I make things for the web and designs awesome user experiences that enrich people's lives"];

    return  <FullWidthSection style={styles.avatarContainer} useContent={false}>
        <MyCard
          avatar={true}
          style={styles.bigPic}
          imgStyle={{width: '100%', maxWidth: '420px'}}
          onClick={() => {
            window.location.href = 'https://github.com/bfwg/mypage';
          }}
          heading={myTitle}
          img={myAvatar} />
          {this._getLinkIconButtonGroup()}
      </FullWidthSection>;
  },

  _getImages: function() {
    let styles = this.getStyles();
    return <FullWidthSection style={styles.imgContainer}>
        <div>
          <h1 style={{fontFamily: 'Monospace'}}> Me and More! </h1>
          <Dropzone disableClick={true} style={styles.addImage} ref='dropzone' onDrop={this.onDrop}>
            <MyCard
              avatar={true}
              onClick={this.onUpload}
              style={{backgroundImage: 'none'}}
              imgStyle={{maxHeight: '100%'}}
              img={`${SERVER_HOST}/images/upload.png`}/>
          </Dropzone>
        </div>
        {this.props.User.images.edges.map((ele, idx) => {
          return (
          <MyCard
            key={idx}
            style={styles.smallPic}
            imgStyle={{maxHeight: '100%'}}
            imgIdx={idx}
            img={`${SERVER_HOST}/images/${ele.node.url}?w=300&q=70`} />
          );
        })}

      </FullWidthSection>;
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

  _getFooter: function() {
    let footerIconSize = 38;
    let styles = this.getStyles();
    return (
      <div style={styles.footer}>
        <p style={this.prepareStyles(styles.p)}>
          {'Hand crafted with love by Fan Jin'}
        </p>
        <a href='https://github.com/bfwg'>
          <GitHubIcon style={{
            color: Colors.grey400,
            width: footerIconSize,
            height: footerIconSize,
          }}/>
        </a>
      </div>
    );
  },

  _getLinkIconButtonGroup: function() {
    let styles = this.getStyles();
    return (
      <div>
        <IconButton
          iconStyle={styles.icon}
          style={styles.iconStyle}
          href='https://www.facebook.com/people/Fan-Jin/100008957509461'
          linkButton={true}
          touch={true} >
          <FaceBook/>
        </IconButton>
        <IconButton
          iconStyle={styles.icon}
          href='https://github.com/bfwg'
          linkButton={true}
          style={styles.iconStyle}
          touch={true} >
          <GitHubIcon/>
        </IconButton>
        <IconButton
          iconStyle={styles.icon}
          style={styles.iconStyle}
          href='https://ca.linkedin.com/in/fan-jin-a65b03a0'
          linkButton={true}
          touch={true} >
          <Linkedin/>
        </IconButton>
      </div>
    );

  },


  getStyles() {
    let iconSize = 48;
    let windowWidth = window.innerWidth - 16;
    let imageMargin = 4;
    let imageWH;
    let imageContainerPadding = Spacing.desktopGutter * 4;
    if (this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
        imageWH = 206;
    } else if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM)) {
        imageContainerPadding = 0;
        imageWH = windowWidth / 3 - imageMargin * 3;
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
      imageResize: {
        wh: imageWH,
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
        lineHeight: imageWH - 4 + 'px',
        marginLeft: imageMargin + 'px',
        marginRight: imageMargin + 'px',
      },
      bigPic: {
        width: '100%',
        maxWidth: '420px',
        marginRight: 'auto',
        padding: '0px',
        backgroundImage: 'none',
      },
      bigPicWhenMedium: {
        // width: '33%',
        maxWidth: '420px',
      },
      addImage: {
        // float: 'none',
        display: 'inline-block',
        borderStyle: 'none',
        width: imageWH + 'px',
        height: imageWH + 'px',
        lineHeight: imageWH - 4 + 'px',
        marginBottom: '20px',
      },
      addImageWhenMedium: {
        // float: 'left',
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


  render() {

    let styles = this.getStyles();

    return (
      <div style={styles.containerStyle}>
        {this._getLoginDialog()}
        {this._getAvatar()}
        {this._getSeparator()}
        {this._getImages()}
        {this._getSeparator()}
        {this._getFooter()}
      </div>
    );
  },

});

module.exports = Relay.createContainer(Main, {

  fragments: {
    User: () => Relay.QL`
      fragment on User {
        username,
        images(first: 30) {
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
