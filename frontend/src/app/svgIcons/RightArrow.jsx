"use strict";
let React = require('react');
let { SvgIcon } = require('material-ui');

const RightArrow = React.createClass({

  propTypes: {
    route: React.PropTypes.string,
  },

  render() {
    return (
      <SvgIcon {...this.props}>
        <path fill="#FFFFFF" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
      </SvgIcon>
    );
  },

});

module.exports = RightArrow;
