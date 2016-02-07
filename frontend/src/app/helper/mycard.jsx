"use strict";
const React = require('react');
const {FloatingActionButton, Dialog, Paper, Mixins, Styles} = require('material-ui');

let {StylePropable, StyleResizable} = Mixins;
let {Colors, Spacing, Transitions, Typography} = Styles;

const {LeftArrow, RightArrow} = require('../svgIcons');

const {SERVER_HOST} = require('../config');


let HomeFeature = React.createClass({

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
    };
  },

  componentDidMount() {

    // this.checkLeftNav(0);
    // this.checkRightNav(0);


    this.setState({
      currentImage: this.props.img,
    });
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
      currentImage: this.props.img,
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

  render() {
    let styles = this.getStyles();

    return (
      <div>
        <Dialog
          open={this.state.imageDialogOpenFlag}
          contentStyle={{width: "100%", textAlign: 'center'}}
          bodyStyle={{padding: '0px'}}
          onRequestClose={this.onImageCanel}>
          <FloatingActionButton secondary={true} mini={true} linkButton={true}
            style={this.mergeStyles(styles.navButton, {left: 0})}
            disabled={this.state.leftNav}
            onTouchTap={this.getPreImg} >
            <LeftArrow />
          </FloatingActionButton>
          <img style={this.mergeStyles(
            styles.image,
            {maxHeight: window.innerHeight - 200})} src={this.state.currentImage} />
          <FloatingActionButton secondary={false} mini={true} linkButton={true}
            style={this.mergeStyles(styles.navButton, {right: 0})}
            disabled={this.state.rightNav}
            onTouchTap={this.getNextImg} >
            <RightArrow />
          </FloatingActionButton>
        </Dialog>
        <Paper
          zDepth={this.state.zDepth}
          onMouseEnter={this._onMouseEnter}
          onMouseLeave={this._onMouseLeave}
          onTouchTap={this.props.onClick || function(){
            this.setState({
              imageDialogOpenFlag: true,
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

module.exports = HomeFeature;
