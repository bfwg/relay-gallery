const React = require('react');
const LinkedStateMixin = require('react-addons-linked-state-mixin');
const {
  TextField,
  RaisedButton,
  CardActions,
  CardTitle,
  Styles,
  Mixins,
} = require('material-ui');

const {Colors, Spacing} = Styles;
const {StyleResizable, StylePropable} = Mixins;

const Login = React.createClass({

  displayName: 'Login',

  propTypes: {
    error: React.PropTypes.string,
    onCancel: React.PropTypes.func,
    pending: React.PropTypes.bool,
    submit: React.PropTypes.func,
  },

  mixins: [StyleResizable, StylePropable, LinkedStateMixin],

  getDefaultProps() {
    return {
    };
  },

  getInitialState: function() {
    return {
      email: '',
      password: '',
    };
  },


  onFormSubmit(e) {
    e.preventDefault();
    let userData = `${this.state.email}:${this.state.password}`;

    this.props.submit(userData);
  },


  getStyles() {
    const styles = {
      root: {
        textAlign: 'center',
      },
      card: {
        maxWidth: "100%",
      },
      cardWhenMedium: {
        maxWidth: Spacing.desktopKeylineIncrement * 7,
      },
      fieldset: {
        border: 'none',
      },
      textField: {
        marginTop: 20,
      },
      buttons: {
        marginTop: 40,
        marginBottom: 30,
      },
      link: {
        marginTop: 10,
      },
      error: {
        color: Colors.pinkA200,
        fontSize: 14,
      },
    };

    if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM) ||
        this.isDeviceSize(StyleResizable.statics.Sizes.LARGE))
      styles.card = this.mergeStyles(styles.card, styles.cardWhenMedium);

    return styles;
  },

  render() {
    const styles = this.getStyles();

    return (
      <div style={styles.root}>
        <div style={styles.card}>
          <form onSubmit={this.onFormSubmit}>
            <fieldset disabled={this.props.pending} style={styles.fieldset}>
              <CardTitle title='Login to Upload' />
              {this.props.error &&
                <div style={styles.error}>{this.props.error}</div>
              }
              <TextField
                floatingLabelText='Username'
                underlineShow={false}
                name='email'
                style={styles.textField}
                valueLink={this.linkState('email')} />
              <TextField
                floatingLabelText='Password'
                name='password'
                type='password'
                valueLink={this.linkState('password')} />
              <div style={styles.buttons}>
                <CardActions>
                  <RaisedButton
                    disabled={this.props.pending}
                    label='Login!'
                    secondary={true}
                    type='submit' />
                </CardActions>
                <CardActions>
                  <RaisedButton
                    onTouchTap={this.props.onCancel}
                    label='Cancel'
                    secondary={false} />
                </CardActions>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    );
  },

});

module.exports = Login;
