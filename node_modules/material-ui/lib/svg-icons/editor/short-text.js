'use strict';

var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var SvgIcon = require('../../svg-icon');

var EditorShortText = React.createClass({
  displayName: 'EditorShortText',

  mixins: [PureRenderMixin],

  render: function render() {
    return React.createElement(
      SvgIcon,
      this.props,
      React.createElement('path', { d: 'M4 9h16v2H4zm0 4h10v2H4z' })
    );
  }

});

module.exports = EditorShortText;