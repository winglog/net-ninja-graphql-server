const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const schema = require('./schema/schema');

const app = express();

// Allow cross-origin requests
app.use(cors());

mongoose.connect('mongodb+srv://winglog:TestAdmin2020%23@maudachcluster-xclic.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.once('open', ()=>{
  console.log('Connected to MaudachCluster on mlab');
});

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true  // <-- This configuration is important to make 'http://localhost:4000/graphql' serve the GraphiQL UI directly.
}));

app.listen(4000, () => {
  console.log('Listening to port 4000...');
});
