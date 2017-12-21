import Express from 'express';

import {graphqlExpress, graphiqlExpress} from 'graphql-server-express'
import bodyParser from 'body-parser'

import {schema} from './schema'

let PORT = 3000;

if (process.env.PORT) {
  PORT = parseInt(process.env.PORT, 10);
}

const app = new Express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// graphql resource - add request token and user to context
app.post('/graphql', graphqlExpress(() => ({
  schema
})))

// graphiql
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}))

app.listen(PORT, () =>
  console.log(
    // eslint-disable-line no-console
    `App Server is now running on http://localhost:${PORT}`
  )
);
