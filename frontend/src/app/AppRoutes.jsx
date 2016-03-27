'use strict';
const React = require('react');
import {Redirect, IndexRoute, IndexRedirect, Router, Route, Link} from 'react-router';

const Relay = require('react-relay');

const Main = require('./components/Main');
const Main2 = require('./components/Main2');
const Test = require('./components/Test');

const UserQueries = {
  User: () => Relay.QL`query { User }`,
};

const AppRoutes = (
  <Route path="/">
    <IndexRoute
      component={Main2}
      queries={UserQueries} />
    <Redirect from="*" to="/" />
  </Route>
);

module.exports = AppRoutes;

