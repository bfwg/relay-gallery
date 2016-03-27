import React from 'react';
import ReactDOM from 'react-dom';
import { useRouterHistory } from 'react-router';
import AppRoutes from './AppRoutes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { createHashHistory } from 'history';
import IsomorphicRelay from 'isomorphic-relay';
import IsomorphicRouter from 'isomorphic-relay-router';

//Needed for React Developer Tools
window.React = React;

//Needed for onTouchTap
//Can go away when react 1.0 release
injectTapEventPlugin();

if (process.env.NODE_ENV === 'production') {
  IsomorphicRelay.injectPreparedData(JSON.parse(document.getElementById('preload').textContent));
}

/**
 * Render the main app component. You can read more about the react-router here:
 */
ReactDOM.render(
  <IsomorphicRouter.Router
    history={useRouterHistory(createHashHistory)({queryKey: false})}
    onReadyStateChange={({ready, done}) => ready && done ? window.scrollTo(0, 0) : null}>
    {AppRoutes}
  </IsomorphicRouter.Router>,
  document.getElementById('app')
);
// ReactDOM.render(
  // <RelayRouter
    // history={useRouterHistory(createHashHistory)({queryKey: false})}
    // onUpdate={() => window.scrollTo(0, 0)}>
    // {AppRoutes}
  // </RelayRouter>,
  // document.getElementById('app')
// );
