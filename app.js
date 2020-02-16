const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true  // <-- This configuration is important to make 'http://localhost:4000/graphql' serve the GraphiQL UI directly.
}));

app.listen(4000, () => {
  console.log('Listening to port 4000...');
});
