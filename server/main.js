global.navigator = { userAgent: 'all' };
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;
const graphQLHTTP = require('express-graphql');
const querySchema = require('../schema/schema').schema;

const cors = require('cors');

const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const multer = require('multer');
import renderOnServer from './renderOnServer';


app.set('x-powered-by', false);
app.use(cors());
app.use(cookieParser());
app.use(session({
  name: 'c.sid',
  store: new RedisStore(),
  secret: 'keyboard cat',
  cookie: { maxAge: 600000 },
  resave: true,
  saveUninitialized: false,
}));



const storage = multer.memoryStorage();
app.use('/graphql', multer({ storage }).single('file'));


app.use('/graphql', graphQLHTTP(req => {
  return ({
    schema: querySchema,
    rootValue: {request: req},
    graphiql: true,
    pretty: true,
  });
}));



app.use(express.static(path.join(__dirname, '../static')));
// app.use(express.static(path.join(__dirname, '/../frontend/build')));

// need for material-ui server-side-rendering
app.get('/*', renderOnServer);


app.listen(PORT, () => {
  console.log('node ' + process.version + ' listen on port ' + PORT + '(' + process.env.NODE_ENV + ')');
});

