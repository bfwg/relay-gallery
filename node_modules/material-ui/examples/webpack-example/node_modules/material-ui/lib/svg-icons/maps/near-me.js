'use strict';

var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var SvgIcon = require('../../svg-icon');

var MapsNearMe = React.createClass({
  displayName: 'MapsNearMe',

  mixins: [PureRenderMixin],

  render: function render() {
    return React.createElement(
      SvgIcon,
      this.props,
      React.createElement('path', { d: 'M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z' })
    );
  }

});

module.exports = MapsNearMe;