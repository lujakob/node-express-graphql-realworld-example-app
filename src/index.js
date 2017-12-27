import Express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import passport from 'passport'

import {graphqlExpress, graphiqlExpress} from 'graphql-server-express';

import {schema} from './schema';
import setLocalStrategy from './config/passport'

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

const app = new Express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


const mongoUri = isProduction ? process.env.MONGODB_URI : 'mongodb://localhost:27017/conduit';

mongoose.Promise = bluebird
mongoose.connect(mongoUri, {useMongoClient: true}, (err, db) => {
  if (err) {
    console.log('---Unable to connect to mongoose. Error', err);
  } else {
    console.log('+++Connected to mongoose')
  }
});

if (isProduction) {
  mongoose.set('debug', true);
}

const db = mongoose.connection

db.on('error', (e) => {
  console.log( '---FAILED to connect to mongoose', e)
});

db.once('open', () => {

  setLocalStrategy();

  // graphql resource - add request token and user to context
  app.post('/graphql', authenticateMiddleware, graphqlExpress(({token}) => ({
    schema,
    context: {
      token
    }
  })));

  // graphiql
  app.use('/graphiql', authenticateMiddleware, graphiqlExpress({
    endpointURL: '/graphql'
  }));

  app.listen(PORT, () =>
    console.log(
      // eslint-disable-line no-console
      `App Server is now running on http://localhost:${PORT}`
    )
  );
});


// check valid token and add user if available
export const authenticateMiddleware = (req, res, next) => {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    console.log(info);
    if(err){
      return next(err);
    }

    if (user) {
      req.token = user.generateJWT();
    }

    next();
  })(req, res, next);
}