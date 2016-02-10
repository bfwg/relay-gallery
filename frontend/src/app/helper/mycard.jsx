"use strict";
const React = require('react');
const {CircularProgress, FloatingActionButton, Dialog, Paper, Mixins, Styles} = require('material-ui');

let {StylePropable, StyleResizable} = Mixins;
let {Colors, Spacing, Transitions, Typography} = Styles;

const {LeftArrow, RightArrow} = require('../svgIcons');

const {SERVER_HOST} = require('../config');


let MyCard = React.createClass({

  mixins: [StylePropable, StyleResizable],

  propTypes: {
    firstChild: React.PropTypes.bool,
    heading: React.PropTypes.string,
    img: React.PropTypes.string,
    lastChild: React.PropTypes.bool,
    route: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      firstChild: false,
      lastChild: false,
    };
  },

  getInitialState() {
    return {
      imageDialogOpenFlag: false,
      currentImage: null,
      offset: 0,
      leftNav: false,
      rigthNav: false,
      zDepth: 0,
      pending: true,
    };
  },

  componentWillMount() {

    // this.checkLeftNav(0);
    // this.checkRightNav(0);
  },
  componentDidMount() {

    // this.checkLeftNav(0);
    // this.checkRightNav(0);
  },

  _onMouseEnter() {
    this.setState({
      zDepth: 4,
    });
  },

  _onMouseLeave() {
    this.setState({
      zDepth: 0,
    });
  },

  onImageCanel: function() {
    this.setState({
      imageDialogOpenFlag: false,
      currentImage: this.props.img.substring(0, this.props.img.lastIndexOf('?')),
      offset: 0,
    });
  },

  checkLeftNav: function(offset) {
    if (this.props.imgIdx + offset !== 0) {
      this.setState({
        leftNav: true,
      });
    } else {
      this.setState({
        leftNav: false,
      });
    }
  },

  checkRightNav: function(offset) {
    // console.log(this.props.imgIdx + offset);
    // console.log(this.props.imgList && this.props.imgList.length - 1);
    if (this.props.imgList && this.props.imgIdx + offset !== this.props.imgList.length - 1) {
      this.setState({
        rightNav: true,
      });
    } else {
      this.setState({
        rightNav: false,
      });
    }
  },

  getPreImg: function() {
    this.setState({
      offset: this.state.offset - 1,
    });

    let index = (this.props.imgIdx + this.state.offset - 1 + this.props.imgList.length) % this.props.imgList.length;
    if (this.props.imgList && this.props.imgList[index]) {
      this.setState({
        currentImage: `${SERVER_HOST}/images/` + this.props.imgList[index].node.url,
      });
      // this.checkLeftNav(this.state.offset - 1);
      // this.checkRightNav(this.state.offset - 1);
    }
  },

  getNextImg: function() {

    this.setState({
      offset: this.state.offset + 1,
    });
    let index = (this.props.imgIdx + this.state.offset + 1) % this.props.imgList.length;
    if (this.props.imgList && this.props.imgList[index]) {
      this.setState({
        currentImage: `${SERVER_HOST}/images/` + this.props.imgList[index].node.url,
      });
      // this.checkLeftNav(this.state.offset + 1);
      // this.checkRightNav(this.state.offset + 1);
    }
  },

  _getNavButton: function(leftOrRight) {
    let styles = this.getStyles();
    let Icon, nav = {}, getImage;
    if (leftOrRight === 'left') {
      Icon = <LeftArrow />;
      nav.left = 0;
      getImage = this.getPreImg;
    } else {
      Icon = <RightArrow />;
      nav.right = 0;
      getImage = this.getNextImg;
    }
    return <FloatingActionButton mini={true} linkButton={true}
            style={this.mergeStyles(styles.navButton, nav)}
            backgroundColor={Colors.grey700}
            disabled={this.state.leftNav}
            onTouchTap={getImage} >
            {Icon}
          </FloatingActionButton>;
  },

  render() {
    let styles = this.getStyles();
    console.log(this.state.currentImage);

    return (
      <div>
        <Dialog
          open={this.state.imageDialogOpenFlag}
          contentStyle={{
            width: "100%",
            textAlign: 'center',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          bodyStyle={{
            padding: '0px',
            backgroundColor: 'black',
          }}
          onRequestClose={this.onImageCanel}>
          {this._getNavButton('left')}
          <img style={this.mergeStyles(
            styles.image,{
              maxHeight: window.innerHeight - 200,
            })}
            onLoad={() => {
              this.setState({
                pending: false,
              });
            }}
            src={this.state.currentImage} />
          {this.state.pending &&
            <div style={{
              backgroundColor: 'black',
              padding: 100,
              textAlign: 'center',
            }}>
              <CircularProgress size={2} />
            </div> }
          {this._getNavButton('right')}
        </Dialog>
        <Paper
          zDepth={this.state.zDepth}
          onMouseEnter={this._onMouseEnter}
          onMouseLeave={this._onMouseLeave}
          onTouchTap={this.props.onClick || function(){
            this.setState({
              imageDialogOpenFlag: true,
            });

            //we set for 10 millisecond for it to response to the progress
            this.setState({
              currentImage: this.props.img.substring(0, this.props.img.lastIndexOf('?')),
            });
          }.bind(this)}
          style={this.mergeStyles(
            styles.root,
            this.props.lastChild && styles.rootWhenLastChild)}>
          <img style={this.mergeStyles(
            styles.image,
            this.props.imgStyle)} src={this.props.img} />
            {this.props.heading && <h3 style={styles.heading} dangerouslySetInnerHTML={{__html: this.props.heading}}></h3>}
        </Paper>
      </div>
    );
  },

  getStyles() {
    let desktopGutter = Spacing.desktopGutter;
    let desktopKeylineIncrement = Spacing.desktopKeylineIncrement;

    let styles = {
      root: {
        transition: Transitions.easeOut(),
        margin: '0 auto ' + desktopGutter + 'px auto',
      },
      rootWhenMedium: {
      },
      image: {
        verticalAlign: "middle",
        maxWidth: "100%",
        //Not sure why this is needed but it fixes a display
        //issue in chrome
        // marginBottom: -6,
      },
      heading: {
        fontSize: '20px',
        marginBottom: '13',
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
      rootWhenLastChild: {
        marginBottom: '0px',
      },
      rootWhenMediumAndLastChild: {
        marginRight: '0px',
        marginBottom: '0px',
      },
      rootWhenMediumAndFirstChild: {
        marginLeft: '0px',
      },
      navButton: {
        position: 'absolute',
        top: '50%',
        marginTop: '-17px',
      },
    };

    styles.root = this.mergeStyles(styles.root, this.props.style);


    return styles;
  },

});

module.exports = MyCard;
