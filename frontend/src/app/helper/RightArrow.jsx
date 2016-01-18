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
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M17.294,9.443L8.459,0.608c-0.812-0.811-2.138-0.811-2.945,0L4.775,1.345c-0.81,0.81-0.81,2.136,0,2.944l6.742,6.743
		l-6.742,6.741c-0.81,0.811-0.81,2.137,0,2.943l0.737,0.737c0.81,0.811,2.136,0.811,2.945,0l8.835-8.836
		c0.435-0.435,0.628-1.018,0.597-1.589C17.922,10.46,17.729,9.877,17.294,9.443z"/>
      </SvgIcon>
    );
  },

});

module.exports = RightArrow;
