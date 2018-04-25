import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from './AppRoutes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { browserHistory, useRouterHistory } from 'react-router';
import IsomorphicRelay from 'isomorphic-relay';
import IsomorphicRouter from 'isomorphic-relay-router';
import { createHashHistory } from 'history';

//Needed for React Developer Tools
window.React = React;

//Needed for onTouchTap
//Can go away when react 1.0 release
injectTapEventPlugin();

let history = useRouterHistory(createHashHistory)({queryKey: false});
// if (process.env.NODE_ENV === 'production') {
  history = browserHistory;
  IsomorphicRelay.injectPreparedData(JSON.parse(document.getElementById('preload').textContent));
// }

/**
 * Render the main app component. You can read more about the react-router here:
 */

ReactDOM.render(
  <IsomorphicRouter.Router
    history={history}
    onReadyStateChange={({ready, done}) => ready && done ? window.scrollTo(0, 0) : null}>
    {AppRoutes}
  </IsomorphicRouter.Router>,
  document.getElementById('app')
);
