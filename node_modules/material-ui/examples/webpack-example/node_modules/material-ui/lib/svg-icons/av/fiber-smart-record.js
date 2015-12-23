'use strict';

var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var SvgIcon = require('../../svg-icon');

var AvFiberSmartRecord = React.createClass({
  displayName: 'AvFiberSmartRecord',

  mixins: [PureRenderMixin],

  render: function render() {
    return React.createElement(
      SvgIcon,
      this.props,
      React.createElement(
        'g',
        { fill: '#010101' },
        React.createElement('circle', { cx: '9', cy: '12', r: '8' }),
        React.createElement('path', { d: 'M17 4.26v2.09c2.33.82 4 3.04 4 5.65s-1.67 4.83-4 5.65v2.09c3.45-.89 6-4.01 6-7.74s-2.55-6.85-6-7.74z' })
      )
    );
  }

});

module.exports = AvFiberSmartRecord;