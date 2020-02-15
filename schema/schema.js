const graphql = require('graphql');
const _ = require('lodash');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema
} = graphql;

// Some dummy data
const books = [
  { name: 'The Art of Loving', genre:'Philosophy', id: '1' },
  { name: 'The Swarm', genre:'Sci-Fi', id: '2' },
  { name: 'The Wandering Earth', genre:'Sci-Fi', id: '3' }
];

const authors = [
  { name: 'Erich Fromm', country:'Germany', rank:'1', id: '1' },
  { name: 'Frank Schätzing', country:'Germany', rank:'22', id: '2' },
  { name: 'Liu Cixin (劉慈欣)', country:'China', rank:'33', id: '3' }
];

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    rank: { type: GraphQLInt },
    country: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {

    book: {
      type: BookType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args){
        // code to get data from database or other source
        return _.find(books, { id: args.id });
      }
    },

    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args){
        // code to get data from database or other source
        return _.find(authors, { id: args.id });
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
