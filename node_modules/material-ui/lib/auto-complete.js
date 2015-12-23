'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react');
var ReactTransitionGroup = require('react-addons-transition-group');
var StylePropable = require('./mixins/style-propable');
var ClickAwayable = require('./mixins/click-awayable');
var KeyCode = require('./utils/key-code');
var TextField = require('./text-field');
var Menu = require('./menus/menu');
var MenuItem = require('./menus/menu-item');
var MenuDivider = require('./menus/menu-divider');

var AutoComplete = React.createClass({
  displayName: 'AutoComplete',

  mixins: [StylePropable, ClickAwayable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    animated: React.PropTypes.bool,
    errorText: React.PropTypes.string,
    floatingLabelText: React.PropTypes.string,
    errorStyle: React.PropTypes.object,
    hintText: React.PropTypes.string,
    searchText: React.PropTypes.string,
    dataSource: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.object]),
    updateWhenFocused: React.PropTypes.bool,
    showAllItems: React.PropTypes.bool,
    menuStyle: React.PropTypes.object,
    listStyle: React.PropTypes.object,
    menuProps: React.PropTypes.object,
    menuCloseDelay: React.PropTypes.number,
    onUpdateInput: React.PropTypes.func,
    onNewRequest: React.PropTypes.func,
    filter: React.PropTypes.func,
    disableFocusRipple: React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      animated: true,
      fullWidth: false,
      open: false,
      showAllItems: false,
      searchText: '',
      menuCloseDelay: 100,
      disableFocusRipple: true,
      updateWhenFocused: false,
      onUpdateInput: function onUpdateInput() {},
      onNewRequest: function onNewRequest() {},
      filter: function filter(searchText, key, value) {
        return key.includes(searchText);
      }
    };
  },

  getInitialState: function getInitialState() {
    return {
      searchText: this.props.searchText,
      open: this.props.open
    };
  },

  componentWillMount: function componentWillMount() {
    this.focusOnInput = false;
    this.requestsList = [];
  },

  componentClickAway: function componentClickAway() {
    this.setState({ open: false });
    this.focusOnInput = false;
  },

  render: function render() {
    var _this = this;

    var _props = this.props;
    var animated = _props.animated;
    var style = _props.style;
    var errorStyle = _props.errorStyle;
    var floatingLabelText = _props.floatingLabelText;
    var hintText = _props.hintText;
    var fullWidth = _props.fullWidth;
    var menuStyle = _props.menuStyle;
    var menuProps = _props.menuProps;
    var listStyle = _props.listStyle;
    var showAllItems = _props.showAllItems;

    var other = _objectWithoutProperties(_props, ['animated', 'style', 'errorStyle', 'floatingLabelText', 'hintText', 'fullWidth', 'menuStyle', 'menuProps', 'listStyle', 'showAllItems']);

    var styles = {
      root: {
        display: 'inline-block',
        position: 'relative',
        width: this.props.fullWidth ? '100%' : 256
      },
      input: {},
      error: {},
      menu: {
        top: this.props.floatingLabelText ? 64 : 40,
        left: 0,
        width: '100%'
      },
      list: {
        display: 'block',
        width: this.props.fullWidth ? '100%' : 256
      }
    };

    var textFieldProps = {
      style: this.mergeAndPrefix(styles.input, style),
      floatingLabelText: floatingLabelText,
      hintText: !hintText && !floatingLabelText ? '' : hintText,
      fullWidth: true,
      multiLine: false,
      errorStyle: this.mergeAndPrefix(styles.error, errorStyle)
    };

    var mergedRootStyles = this.mergeAndPrefix(styles.root, style);
    var mergedMenuStyles = this.mergeStyles(styles.menu, menuStyle);

    if (Array.isArray(this.props.dataSource)) {

      if (this.props.showAllItems && this.state.searchText === '') {
        this.requestsList = this.props.dataSource;
      } else {
        this.requestsList = this.props.dataSource.filter(function (s) {
          return _this.props.filter(_this.state.searchText, s);
        });
      }
    } else {
      var list = [];
      if (this.props.showAllItems && this.state.searchText === '') {
        for (var k in this.props.dataSource) {
          list.push(this.props.dataSource[k]);
        }
      } else {
        for (var k in this.props.dataSource) {
          if (this.props.filter(this.state.searchText, k, this.props.dataSource[k])) {
            list.push(this.props.dataSource[k]);
          }
        }
      }
      this.requestsList = list;
    }

    var requestsList = this.requestsList;

    var menu = this.state.open && (this.state.searchText !== '' || showAllItems) && requestsList && requestsList.length > 0 ? React.createElement(
      Menu,
      _extends({}, menuProps, {
        ref: 'menu',
        key: 'dropDownMenu',
        animated: animated,
        autoWidth: false,
        initiallyKeyboardFocused: false,
        onEscKeyDown: function () {
          return _this.setState({ open: false });
        },
        onItemTouchTap: this._handleItemTouchTap,
        listStyle: this.mergeAndPrefix(styles.list, listStyle),
        openDirection: 'bottom-left',
        style: mergedMenuStyles }),
      requestsList.map(function (request, index) {
        switch (typeof request) {
          case 'string':
            return React.createElement(MenuItem, {
              disableFocusRipple: _this.props.disableFocusRipple,
              innerDivStyle: { overflow: 'hidden' },
              key: index,
              value: request,
              primaryText: request
            });
          case 'object':
            return React.cloneElement(request, {
              key: index,
              disableFocusRipple: _this.props.disableFocusRipple
            });
          default:
            return null;
        }
      })
    ) : null;

    return React.createElement(
      'div',
      { style: mergedRootStyles,
        onKeyDown: this._handleKeyDown },
      React.createElement(
        'div',
        {
          style: {
            width: '100%'
          } },
        React.createElement(TextField, _extends({}, other, {
          ref: 'searchTextField',
          value: this.state.searchText,
          onEnterKeyDown: function () {
            setTimeout(function () {
              _this.setState({ open: false });
            }, _this.props.touchTapCloseDelay);
            _this.props.onNewRequest(_this.state.searchText);
          },
          onChange: function (e) {
            var searchText = e.target.value;
            _this._updateRequests(searchText);
          },
          onBlur: function () {
            if (_this.focusOnInput && _this.state.open) _this.refs.searchTextField.focus();
          },
          onFocus: function () {
            if (!_this.state.open && (showAllItems || _this.props.updateWhenFocused || _this.state.searchText !== '')) {
              _this._updateRequests(_this.state.searchText);
            }
            _this.focusOnInput = true;
          }

        }, textFieldProps))
      ),
      React.createElement(
        ReactTransitionGroup,
        null,
        menu
      )
    );
  },

  setValue: function setValue(textValue) {
    this.setState({
      searchText: textValue
    });
  },

  getValue: function getValue() {
    return this.state.searchText;
  },

  _updateRequests: function _updateRequests(searchText) {

    this.setState({
      searchText: searchText,
      open: true
    });

    this.focusOnInput = true;

    this.props.onUpdateInput(searchText, this.props.dataSource);
  },

  _handleItemTouchTap: function _handleItemTouchTap(e, child) {
    var _this2 = this;

    setTimeout(function () {
      _this2.setState({ open: false });
    }, this.props.touchTapCloseDelay);

    var dataSource = this.props.dataSource;
    var chosenRequest = this.requestsList[parseInt(child.key, 10)];

    var index = Array.isArray(dataSource) ? dataSource.indexOf(chosenRequest) : Object.keys(dataSource).filter(function (key) {
      return chosenRequest === dataSource[key];
    })[0];

    this.setState({ searchText: Array.isArray(dataSource) ? dataSource[index] : index });

    this.props.onNewRequest(chosenRequest, index, dataSource);
  },

  _handleKeyDown: function _handleKeyDown(e) {
    switch (e.keyCode) {
      case KeyCode.ESC:
        this.setState({ open: false });
        break;
      case KeyCode.DOWN:
        if (this.focusOnInput && this.state.open) {
          e.preventDefault();
          this.focusOnInput = false;
          this.setState({ open: true });
        }
        break;
      default:
        break;
    }
  }

});

AutoComplete.Item = MenuItem;
AutoComplete.Divider = MenuDivider;

module.exports = AutoComplete;