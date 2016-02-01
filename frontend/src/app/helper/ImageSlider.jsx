"use strict";
const React = require('react');
const Slider = require('react-slick');
const {SERVER_HOST} = require('../config');

const SimpleSlider = React.createClass({
  render: function () {
    const settings = {
      arrows: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      initialSlide: 0,
    };
    const styles = this.getStyles();
    return (
      <Slider {...settings}>
        {this.props.imgList.map((ele, i) =>
          <img key={i} style={styles.image} src={`${SERVER_HOST}/images/${ele.node.url}`} />
        )}
      </Slider>
    );
  },


  getStyles() {

    let styles = {
      image: {
        verticalAlign: "middle",
        maxWidth: "100%",
        maxHeight: 500,
      },
    };
    return styles;
  },
});

module.exports = SimpleSlider;
