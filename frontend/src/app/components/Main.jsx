const React = require('react');
const Relay = require('react-relay');
const Helmet = require('react-helmet');
const {Colors, getMuiTheme} = require('material-ui/lib/styles');
const ChangeUserStatusMutation  = require('../mutation/ChangeUserStatusMutation');
const {CircularProgress, Dialog, IconButton, Mixins, Styles} = require('material-ui');
const {StylePropable, StyleResizable} = Mixins;
const {Spacing} = Styles;
const {FullWidthSection, MyRawTheme} = require('../helper');
const {GitHubIcon, FaceBook, Linkedin} = require('../svgIcons');
const Login = require('./Login');
const AddImageMutation  = require('../mutation/AddImageMutation');
const Dropzone = require('react-dropzone');
const MyCard = require('./MyCard');
const Separator = require('./Separator');
const classNames = require('classnames');

import { Link } from 'react-router';


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

  onDrop: function(files) {
    if (this.props.User.username === 'Guest') {
      this.setState({
        loginDialogOpenFlag: true,
      });
    } else {
      let onSuccess = () => {
        //console.log('Mutation successful!');
      };
      let onFailure = (transaction) => {
        let error = transaction.getError().source.errors[0].message || new Error('Mutation failed.');
        //console.log(error);
      };
      /*
       * TODO fire mutliple mutations triggars warnings
       */
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

    const onSuccess = () => {
      this.setState({
        loginError: '',
        loginPending: false,
        loginDialogOpenFlag: false,
      });
      this.refs.dropzone.open();
      //console.log('Login successful!');
    };

    const onFailure = (transaction) => {
      const error = transaction.getError().source.errors[0].message || new Error('Mutation failed.');
      //console.log(error);
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
    let myAvatar = '/images/me.jpg';
    /* Issue: https://github.com/facebook/react/issues/6038
      Put 6666 for now  */
    let myTitle = ['Hi, My name is ',
      <span key={6666} style={{color: 'purple'}}>Fan Jin</span>,
        '. I make things for the web and design awesome user experiences that enrich people\'s lives'];

    return  (
      <div useContent={false}>
        <MyCard
          avatar={true}
          style={styles.bigPic}
          imgStyle={{width: '100%'}}
          heading={myTitle}
          img={myAvatar} />
          {this._getLinkIconButtonGroup()}
      </div>
    );
  },

  _getImages: function() {
    let styles = this.getStyles();
    return (
      <div>
        <div>
          <h1 style={{fontFamily: 'Monospace'}}><Link to={'/whatelse'}>What else?</Link></h1>
          <MyCard
            upload={true}
            onClick={this.onUpload}
            style={styles.addImage}
            img={'/images/upload.png'}/>
          <Dropzone style={{disply: 'none'}} disableClick={true}  ref="dropzone" onDrop={this.onDrop}/>
        </div>
        {this.props.User.images.edges.map((ele, idx) => {
          return (
            <MyCard
              key={ele.node.id}
              loading={!ele.node.url}
              style={styles.smallPic}
              imgIdx={idx}
              img={`/images/${ele.node.url}?w=300&q=70`} />
          );
        })}

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


  getStyles() {
    const iconSize = 48;
    const imageMargin = 4;
    // let imageW = 206;
    // let imageH = 206;
    // if (this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
        // imageW = 206;
        // imageH = 206;
    // } else if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM)) {
      // imageW = 'calc(33% - ' + (imageMargin * 6 - 4) + 'px)';
      // if (typeof window !== 'undefined') {
        // imageH = (window.innerWidth - 16) / 3 - imageMargin * 6;
      // }
    // } else {
      // imageW = 'calc(50% - ' + (imageMargin * 4 - 4) + 'px)';
      // if (typeof window !== 'undefined') {
        // imageH = (window.innerWidth - 16) / 2 - imageMargin * 4;
      // }
    // }
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
      smallPic: {
        display: 'inline-block',
        // maxWidth: '300px',
        // maxHeight: '300px',
        // width: imageW,
        // height: imageH,
        marginLeft: imageMargin + 'px',
        marginRight: imageMargin + 'px',
      },
      bigPic: {
        height: 'auto',
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
        // maxWidth: '300px',
        // maxHeight: '300px',
        borderStyle: 'none',
        // width: imageW,
        // height: imageH,
        marginBottom: '20px',
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
    }


    return styles;
  },


  render() {

    let styles = this.getStyles();
    // console.log(this.props);

    return (
      <div className="container">
        <Helmet
          htmlAttributes={{'lang': 'en', 'amp': undefined}} // amp takes no value
          title="Fan Jin"
          meta={[
              {'name': 'description', 'content': 'This website is build by Fan Jin using React Graphql Relay Redis NodeJs Material-ui and etc'},
              {'name': 'viewport', 'content': 'width=device-width, initial-scale=1, user-scalable=no'},
          ]} />
        {this._getLoginDialog()}
        {this._getAvatar()}
        <Separator />
        {this._getImages()}
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
      ${AddImageMutation.getFragment('images')},
      ${ChangeUserStatusMutation.getFragment('user')},
      }
    `,
  },
});
