'use strict';
const React = require('react');
import {Redirect, IndexRoute, IndexRedirect, Router, Route, Link} from 'react-router';

const Relay = require('react-relay');

const Main = require('./components/Main');
const Master = require('./components/Master');
const Whatelse = require('./components/Whatelse');

const UserQueries = {
  User: () => Relay.QL`query { User }`,
};

const AppRoutes = (
  <Route path="/" component={Master}>
    <IndexRoute
      component={Main}
      queries={UserQueries} />
    <Route path="/whatelse" component={Whatelse} />
    <Redirect from="*" to="/" />
  </Route>
);

module.exports = AppRoutes;

