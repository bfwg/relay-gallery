'use strict';

var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var SvgIcon = require('../../svg-icon');

var EditorDragHandle = React.createClass({
  displayName: 'EditorDragHandle',

  mixins: [PureRenderMixin],

  render: function render() {
    return React.createElement(
      SvgIcon,
      this.props,
      React.createElement('path', { d: 'M20 9H4v2h16V9zM4 15h16v-2H4v2z' })
    );
  }

});

module.exports = EditorDragHandle;