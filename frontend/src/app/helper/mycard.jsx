const React = require('react');
const {Paper, Mixins, Styles} = require('material-ui');

let {StylePropable, StyleResizable} = Mixins;
let {Colors, Spacing, Transitions, Typography} = Styles;


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
      zDepth: 0,
    };
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

  render() {
    let styles = this.getStyles();

    return (
      <Paper
        zDepth={this.state.zDepth}
        onMouseEnter={this._onMouseEnter}
        onMouseLeave={this._onMouseLeave}
        onTouchTap={this.props.onClick || function(){}}
        style={this.mergeAndPrefix(
          styles.root,
          this.props.lastChild && styles.rootWhenLastChild)}>
        <img style={this.mergeAndPrefix(
          styles.image,
          this.props.imgStyle)} src={this.props.img} />
        <h3 style={styles.heading}>{this.props.heading}</h3>
      </Paper>
    );
  },

  getStyles() {
    let desktopGutter = Spacing.desktopGutter;
    let desktopKeylineIncrement = Spacing.desktopKeylineIncrement;

    let styles = {
      root: {
        transition: Transitions.easeOut(),
        maxWidth: '300px',
        float: 'none',
        margin: '0 auto ' + desktopGutter + 'px auto',
        marginRight: 'auto',
      },
      rootWhenMedium: {
        width: '33%',

        // maxWidth: maxWidth,
      },
      image: {
        maxWidth: "100%",
        //Not sure why this is needed but it fixes a display
        //issue in chrome
        marginBottom: -6,
      },
      heading: {
        fontSize: '20px',
        paddingTop: 19,
        marginBottom: '13',
        letterSpacing: 0,
        fontWeight: Typography.fontWeightMedium,
        color: Typography.textDarkBlack,
        backgroundColor: Colors.grey50,
        textAlign: 'center',
        margin: '0px',
        padding: '0px',
        lineHeight: desktopKeylineIncrement + 'px',
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
    };

    if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM) ||
        this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
      styles.root = this.mergeAndPrefix(
        styles.root,
        styles.rootWhenMedium,
        this.props.style,
        this.props.firstChild && styles.rootWhenMediumAndFirstChild,
        this.props.lastChild && styles.rootWhenMediumAndLastChild
      );
    }

    return styles;
  },

});

module.exports = HomeFeature;
