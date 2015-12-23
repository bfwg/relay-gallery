'use strict';

var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var SvgIcon = require('../../svg-icon');

var AvFiberManualRecord = React.createClass({
  displayName: 'AvFiberManualRecord',

  mixins: [PureRenderMixin],

  render: function render() {
    return React.createElement(
      SvgIcon,
      this.props,
      React.createElement('circle', { fill: '#010101', cx: '12', cy: '12', r: '8' })
    );
  }

});

module.exports = AvFiberManualRecord;