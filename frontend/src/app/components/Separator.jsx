const React = require('react');
const {Mixins} = require('material-ui');
const {StylePropable} = Mixins;

const Separator = React.createClass({

  mixins: [StylePropable],

  render() {
    return (
      <div style={{
                    margin: '0 auto',
                    maxWidth: 1050,
                }}>
        <hr />
      </div>
    );
  },
});


module.exports = Separator;
