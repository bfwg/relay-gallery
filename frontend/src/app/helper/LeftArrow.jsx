"use strict";
let React = require('react');
let { SvgIcon } = require('material-ui');

const LeftArrow = React.createClass({

  propTypes: {
    route: React.PropTypes.string,
  },

  render() {
    return (
      <SvgIcon {...this.props}>
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M10.544,11.031l6.742-6.742c0.81-0.809,0.81-2.135,0-2.944l-0.737-0.737
		c-0.81-0.811-2.135-0.811-2.945,0L4.769,9.443c-0.435,0.434-0.628,1.017-0.597,1.589c-0.031,0.571,0.162,1.154,0.597,1.588
		l8.835,8.834c0.81,0.811,2.135,0.811,2.945,0l0.737-0.737c0.81-0.808,0.81-2.134,0-2.943L10.544,11.031z"/>
      </SvgIcon>
    );
  },

});

module.exports = LeftArrow;
