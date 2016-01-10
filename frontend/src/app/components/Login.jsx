"use strict";
const React = require('react');
const LinkedStateMixin = require('react-addons-linked-state-mixin');
const {SERVER_HOST} = require('../config');
const request = require('superagent');
const axios = require('axios');
const {
  TextField,
  RaisedButton,
  Card,
  CardActions,
  CardTitle,
  Styles,
  Mixins,
} = require('material-ui');

const {Colors, Spacing} = Styles;
const {StyleResizable, StylePropable} = Mixins;

const Login = React.createClass({

  mixins: [StyleResizable, StylePropable, LinkedStateMixin],

  propTypes: {
    redirectRoute: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      redirectRoute: '/business',
    };
  },

  getInitialState: function() {
    return {
      pending: false,
      email: '',
      password: '',
      error: '',
      isLogin: false,
    };
  },


  onFormSubmit(e) {
    e.preventDefault();

    let email = this.state.email;
    let password = this.state.password;
    let loginFlag = false;
    let resEmail = '';

    this.setState({
      pending: true,
    });

    axios({
      method: 'post',
      data: {email: email, password: password},
      url: `${SERVER_HOST}/login`,
      withCredentials: true,
    })
    .then(response => {
      if (response.status !== 200)
        throw new Error('用户名或密码错误');
      else {
        // this.props.submit();
        loginFlag = true;//mercy
        resEmail = response.data;
        this.setState({
          pending: false,
        });
      }
    })
    .catch(error => {
      this.setState({error: error});
      this.focusInvalidField(error);
    });

    //will change this in the future
    //due to dropzone bug
    //https://github.com/paramaggarwal/react-dropzone/issues/122
    setTimeout(() => {
      if(loginFlag)
        this.props.submit(resEmail);
    }, 750);
  },

  focusInvalidField(error) {
    if (error instanceof Error) {
      if (!error.prop) return;
      const node = React.findDOMNode(this);
      if (!node) return;
      const el = node.querySelector(`[name=${error.prop}]`);
      if (!el) return;
      el.focus();
      return;
    }
  },

  redirectAfterLogin() {
    //TODO
  },

  getStyles() {
    const styles = {
      root: {
        textAlign: 'center',
      },
      card: {
        maxWidth: Spacing.desktopKeylineIncrement * 7,
      },
      cardWhenMedium: {
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
        fontSize: 20,
      },
    };

    // if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM) ||
        // this.isDeviceSize(StyleResizable.statics.Sizes.LARGE))
      // styles.card = this.mergeStyles(styles.card, styles.cardWhenMedium);

    return styles;
  },

  render() {
    const styles = this.getStyles();


    return (
      <div style={styles.root}>
        <div style={styles.card}>
          <form onSubmit={this.onFormSubmit}>
            <fieldset disabled={this.state.pending} style={styles.fieldset}>
              <CardTitle title="Login to Upload" />
              {this.state.error &&
                <div style={styles.error}>{this.state.error.message}</div>
              }
              <TextField
                floatingLabelText="Username"
                name="email"
                style={styles.textField}
                valueLink={this.linkState('email')} />
              <TextField
                floatingLabelText="Password"
                name="password"
                type="password"
                valueLink={this.linkState('password')} />
              <div style={styles.buttons}>
                <CardActions>
                  <RaisedButton
                    disabled={this.state.pending}
                    label="Login!"
                    secondary={true}
                    type="submit" />
                </CardActions>
                <CardActions>
                  <RaisedButton
                    onTouchTap={this.props.onCancel}
                    label="Cancel"
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
