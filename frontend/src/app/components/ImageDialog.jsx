const React = require('react');
const {CircularProgress, FloatingActionButton, Dialog, Mixins} = require('material-ui');
const {StylePropable, StyleResizable} = Mixins;
const {LeftArrow, RightArrow} = require('../svgIcons');
const {SERVER_HOST} = require('../config');

const ImageDialog = React.createClass({

  displayName: 'ImageDialog',

  propTypes: {
    imageDialogOpenFlag: React.PropTypes.bool,
    imageStyle: React.PropTypes.object,
    imgIdx: React.PropTypes.number,
    imgUrl: React.PropTypes.string,
    onImageCanel: React.PropTypes.func,
  },

  contextTypes: {
    imageList: React.PropTypes.array,
  },

  mixins: [StylePropable, StyleResizable],

  getInitialState() {
    return {
      currentImage: null,
      offset: 0,
      leftNav: false,
      rigthNav: false,
      pending: true,
    };
  },

  componentWillMount() {
    this.setState({
      currentImage: this.props.imgUrl.substring(0, this.props.imgUrl.lastIndexOf('?')),
    });
  },

  onImageCanel: function() {
    /* reset current image and offset of dialog */
    this.setState({
      currentImage: this.props.imgUrl.substring(0, this.props.imgUrl.lastIndexOf('?')),
      offset: 0,
    });
    this.props.onImageCanel();
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
    // console.log(this.context.imageList && this.context.imageList.length - 1);
    if (this.context.imageList && this.props.imgIdx + offset !== this.context.imageList.length - 1) {
      this.setState({
        rightNav: true,
      });
    } else {
      this.setState({
        rightNav: false,
      });
    }
  },

  _getNavButton: function(leftOrRight) {
    let styles = this.getStyles();
    let Icon, nav = {}, getImage = function() {};
    if (leftOrRight === 'left') {
      Icon = <LeftArrow />;
      nav.left = 0;
      if (this.context.imageList.length > 1) {
        getImage = this.getPreImg;
      }
    } else {
      Icon = <RightArrow />;
      nav.right = 0;
      if (this.context.imageList.length > 1) {
        getImage = this.getNextImg;
      }
    }

    return <FloatingActionButton mini={true} linkButton={true}
            style={this.mergeStyles(styles.navButton, nav)}
            disabled={this.state.leftNav}
            onTouchTap={getImage} >
            {Icon}
          </FloatingActionButton>;
  },

  getPreImg: function() {
    this.setState({
      offset: this.state.offset - 1,
    });

    const index = Math.abs(this.props.imgIdx + this.state.offset - 1 + this.context.imageList.length)
    % this.context.imageList.length;
    console.log(index);
    if (this.context.imageList && this.context.imageList[index]) {
      this.setState({
        currentImage: `${SERVER_HOST}/images/` + this.context.imageList[index].node.url,
        pending: true,
      });
      // this.checkLeftNav(this.state.offset - 1);
      // this.checkRightNav(this.state.offset - 1);
    }
  },

  getNextImg: function() {

    this.setState({
      offset: this.state.offset + 1,
    });
    let index = (this.props.imgIdx + this.state.offset + 1) % this.context.imageList.length;
    console.log(index);
    if (this.context.imageList && this.context.imageList[index]) {
      this.setState({
        currentImage: `${SERVER_HOST}/images/` + this.context.imageList[index].node.url,
        pending: true,
      });
      // this.checkLeftNav(this.state.offset + 1);
      // this.checkRightNav(this.state.offset + 1);
    }
  },
  getStyles() {

    let styles = {
      navButton: {
        position: 'absolute',
        top: '50%',
        marginTop: '-17px',
        //need a line height because the dialog line height is set to 300
        lineHeight: '20px',
      },
    };

    return styles;
  },

  render() {
    return (
      <Dialog
        open={this.props.imageDialogOpenFlag}
        contentStyle={{
          width: '100%',
          textAlign: 'center',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        bodyStyle={{
          padding: '0px',
          minHeight: '300px',
          lineHeight: '300px',
          backgroundColor: 'black',
        }}
        onRequestClose={this.onImageCanel}>
        {this._getNavButton('left')}
        <img style={this.mergeStyles(
          this.props.imageStyle, {
            maxHeight: window.innerHeight - 200,
            display: this.state.pending ? 'none' : 'inline',
          })}
          onLoad={() => {
            this.setState({
              pending: false,
            });
          }}
          src={this.state.currentImage} />
        {this.state.pending &&
          <div style={{
            top: '50%',
            left: '50%',
            marginTop: '-70px',
            marginLeft: '-70px',
            position: 'absolute',
            lineHeight: '20px',
          }}>
            <CircularProgress size={2} />
          </div> }
        {this._getNavButton('right')}
      </Dialog>
    );
  },
});

module.exports = ImageDialog;
