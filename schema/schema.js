const graphql = require('graphql');
const _ = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

// Some dummy data
const books = [
  { name: 'The Art of Loving', genre:'Philosophy', id: '1' },
  { name: 'The Swarm', genre:'Sci-Fi', id: '2' },
  { name: 'The Wandering Earth', genre:'Sci-Fi', id: '3' }
];

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLString }},
      resolve(parent, args){
        // code to get data from database or other source
        return _.find(books, { id: args.id });
      }
    }
  }
});

// Remark:
/*
The corresponding Query from Frontend looks like this:
query {
  book(id: "1"){   // <-- Take care: This MUST be double-quotes in GraphiQL
    name,
    gernre
  }
}

*/

module.exports = new GraphQLSchema({
  query: RootQuery // <-- This tells us how we initially jump into the graph!
});
