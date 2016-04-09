import npmPackage from '../package.json';
import IsomorphicRouter from 'isomorphic-relay-router';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Relay from 'react-relay';
import {match} from 'react-router';
import routes from '../frontend/src/app/AppRoutes';
import Helmet from 'react-helmet';
import Html from './Html';
import seqqueue from 'seq-queue';

const GRAPHQL_URL = 'http://localhost:3000/graphql';
// Create a queue for isomorphic loading of pasges, because the GrapQL network layer
// is a static
const requestQueue = seqqueue.createQueue( 2000 );


const renderPage = (data, props) => {
  const appHtml = ReactDOMServer.renderToString(
    <IsomorphicRouter.RouterContext {...props} />
  );
  const helmet = Helmet.rewind();
  const preloadedData = JSON.stringify(data);
  const preload = `<script id="preload" type="application/json">${preloadedData}</script>`;
  const scriptHtml = `<script src="/app.js?v=${npmPackage.version}"></script>`;
  const docHtml = ReactDOMServer.renderToStaticMarkup(
    <Html
      appCssFilename={`/css/main.css?v=${npmPackage.version}`}
      bodyHtml={`<div id="app">${appHtml}</div>${preload}${scriptHtml}`}
      googleAnalyticsId={''}
      helmet={helmet}
      isProduction={true}
    />
  );
  return `<!DOCTYPE html>${docHtml}`;
};

export default (req, res, next) => {
  match({routes, location: req.originalUrl}, (error, redirectLocation, renderProps) => {
    if (error) {
      next(error);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      requestQueue.push(queueTask => {
        Relay.injectNetworkLayer(new Relay.DefaultNetworkLayer(GRAPHQL_URL, {
          headers: req.headers,
        }));
        IsomorphicRouter.prepareData(renderProps).then(({data, props}) => {
          res.send(renderPage(data, props));
          queueTask.done();
        }, next);
      });
    } else {
      res.status(404).send('Not Found');
    }
  });
};
