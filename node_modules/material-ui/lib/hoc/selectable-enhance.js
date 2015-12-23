'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var ThemeManager = require('../styles/theme-manager');
var StylePropable = require('../mixins/style-propable');
var ColorManipulator = require('../utils/color-manipulator');
var DefaultRawTheme = require('../styles/raw-themes/light-raw-theme');

var SelectableContainerEnhance = function SelectableContainerEnhance(Component) {
  var composed = React.createClass({

    mixins: [StylePropable],

    contextTypes: {
      muiTheme: React.PropTypes.object
    },

    displayName: 'Selectable' + Component.displayName,

    propTypes: {
      valueLink: React.PropTypes.shape({
        value: React.PropTypes.number,
        requestChange: React.PropTypes.func
      }).isRequired,
      selectedItemStyle: React.PropTypes.object
    },

    childContextTypes: {
      muiTheme: React.PropTypes.object
    },

    getChildContext: function getChildContext() {
      return {
        muiTheme: this.state.muiTheme
      };
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
      var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
      this.setState({ muiTheme: newMuiTheme });
    },

    getInitialState: function getInitialState() {
      return {
        muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme)
      };
    },

    getValueLink: function getValueLink(props) {
      return props.valueLink || {
        value: props.value,
        requestChange: props.onChange
      };
    },

    render: function render() {
      var _this = this;

      var _props = this.props;
      var children = _props.children;
      var selectedItemStyle = _props.selectedItemStyle;

      var listItems = undefined;
      var keyIndex = 0;
      var styles = {};

      if (!selectedItemStyle) {
        var textColor = this.state.muiTheme.rawTheme.palette.textColor;
        var selectedColor = ColorManipulator.fade(textColor, 0.2);
        styles = {
          backgroundColor: selectedColor
        };
      }

      listItems = React.Children.map(children, function (child) {
        if (child.type.displayName === "ListItem") {
          var selected = _this._isChildSelected(child, _this.props);
          var selectedChildrenStyles = {};
          if (selected) {
            selectedChildrenStyles = _this.mergeStyles(styles, selectedItemStyle);
          }

          var mergedChildrenStyles = _this.mergeStyles(child.props.style || {}, selectedChildrenStyles);

          keyIndex += 1;

          return React.cloneElement(child, {
            onTouchTap: function onTouchTap(e) {
              _this._handleItemTouchTap(e, child);
              if (child.props.onTouchTap) {
                child.props.onTouchTap(e);
              };
            },
            key: keyIndex,
            style: mergedChildrenStyles
          });
        } else {
          return child;
        }
      });
      var newChildren = listItems;

      return React.createElement(
        Component,
        _extends({}, this.props, this.state),
        newChildren
      );
    },

    _isChildSelected: function _isChildSelected(child, props) {
      var itemValue = this.getValueLink(props).value;
      var childValue = child.props.value;

      return itemValue && itemValue === childValue;
    },

    _handleItemTouchTap: function _handleItemTouchTap(e, item) {
      var valueLink = this.getValueLink(this.props);
      var itemValue = item.props.value;
      var menuValue = valueLink.value;
      if (itemValue !== menuValue) {
        valueLink.requestChange(e, itemValue);
      }
    }

  });
  return composed;
};
exports.SelectableContainerEnhance = SelectableContainerEnhance;