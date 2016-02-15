"use strict";
const React = require('react');
const {FloatingActionButton, Dialog, Paper, Mixins, Styles} = require('material-ui');

const {StylePropable, StyleResizable} = Mixins;
const {Colors, Spacing, Transitions, Typography} = Styles;

const {LeftArrow, RightArrow} = require('../svgIcons');

const {SERVER_HOST} = require('../config');
const ImageDialog = require('./ImageDialog');


let MyCard = React.createClass({

  displayName: 'MyCard',

  propTypes: {
    avatar: React.PropTypes.bool,
    heading: React.PropTypes.array,
    img: React.PropTypes.string,
    imgIdx: React.PropTypes.number,
    imgStyle: React.PropTypes.object,
    onClick: React.PropTypes.func,
    style: React.PropTypes.object,
  },

  contextTypes: {
    imageList: React.PropTypes.array,
  },

  mixins: [StylePropable, StyleResizable],

  getDefaultProps() {
    return {
    };
  },

  getInitialState() {
    return {
      imageDialogOpenFlag: false,
      zDepth: 1,
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
      zDepth: 5,
    });
  },

  _onMouseLeave() {
    this.setState({
      zDepth: 1,
    });
  },

  onImageCanel: function() {
    this.setState({
      imageDialogOpenFlag: false,
    });
  },


  getStyles() {
    let desktopGutter = Spacing.desktopGutter;
    let desktopKeylineIncrement = Spacing.desktopKeylineIncrement;

    let styles = {
      root: {
        transition: Transitions.easeOut(),
        backgroundImage: `url(${this.props.img})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'noRepeat',
        backgroundPosition: '50% 25%',
        // margin: '0 auto ' + desktopGutter + 'px auto',
        margin: '0 auto ' + 4 + 'px auto',
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
        fontFamily: 'monospace',
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
    };

    return styles;
  },

  render() {

    let styles = this.getStyles();

    return (
      <div onMouseEnter={function() {console.log('mouse Enter'); }}>
        <ImageDialog
          imageDialogOpenFlag={this.state.imageDialogOpenFlag}
          onImageCanel={this.onImageCanel}
          imgUrl={this.props.img}
          imageStyle={styles.image}
          imgIdx={this.props.imgIdx} />
        <Paper
          zDepth={this.state.zDepth}
          onMouseEnter={this._onMouseEnter}
          onMouseLeave={this._onMouseLeave}
          onTouchTap={this.props.onClick || function(){
            this.setState({
              imageDialogOpenFlag: true,
            });

            this.setState({
              currentImage: this.props.img.substring(0, this.props.img.lastIndexOf('?')),
            });
          }.bind(this)}
          style={this.mergeStyles(styles.root,
                this.props.style)}>
          {this.props.avatar &&
            <img style={this.mergeStyles(
            styles.image,
            this.props.imgStyle)} src={this.props.img} />}
          {this.props.heading && <h3 style={styles.heading}>{this.props.heading}</h3>}
        </Paper>
      </div>
    );
  },
});

module.exports = MyCard;
