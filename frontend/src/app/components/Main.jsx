const React = require('react');
const Relay = require('react-relay');
const CircularProgress = require('material-ui/lib/circular-progress');
const Dialog = require('material-ui/lib/dialog');
const IconButton = require('material-ui/lib/icon-button');
const Styles = require('material-ui/lib/styles');

const Mixins = require('material-ui/lib/mixins');
const {StylePropable, StyleResizable} = Mixins;
const {Colors, getMuiTheme} = require('material-ui/lib/styles');
const {Spacing} = Styles;
const {FullWidthSection, MyRawTheme} = require('../helper');
// const {SERVER_HOST} = require('../config');


Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
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










  getStyles() {
    const iconSize = 48;
    const windowWidth = 1000;
    const imageMargin = 4;
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
    const imgContainerWidth = windowWidth - ((windowWidth - imageContainerPadding * 2) % (imageWH + imageMargin * 2));
    const styles = {
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
        padding: '0px',
      },
      avatarContainerWhenMedium: {
        padding: '24px',
      },
      imageResize: {
        wh: imageWH,
      },
      imgContainer: {
        display: 'inline-block',
        // paddingRight: imageContainerPadding,
        // paddingLeft: imageContainerPadding,
        width: '100%',
        maxWidth: (imageWH + imageMargin * 2) * 5,
        // marginLeft: (windowWidth - imgContainerWidth) / 2,
      },
      imgContainerWhenMedium: {
        width: imgContainerWidth,
      },
      smallPic: {
        display: 'inline-block',
        // float: 'left',
        width: imageWH + 'px',
        height: imageWH + 'px',
        marginLeft: imageMargin + 'px',
        marginRight: imageMargin + 'px',
      },
      bigPic: {
        width: '100%',
        maxWidth: '395px',
        marginRight: 'auto',
        padding: '0px',
        backgroundImage: 'none',
      },
      bigPicWhenMedium: {
        // width: '33%',
        maxWidth: '395px',
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
      styles.img = this.mergeStyles(
        styles.imgContainer,
        styles.imgContainerWhenMedium
      );

    }
    return styles;
  },


  render() {

    let styles = this.getStyles();
    // console.log(this.props);
    // console.log(window.innerWidth - 16);
    // console.log(document.documentElement.clientWidth - 16);


    return (
      <div style={styles.containerStyle}>
      abc
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
