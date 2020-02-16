/**
 * Important note from Net Ninja:
 * The fields inside BookType and AuthorType are both wrapped inside a function.
 * Reason: BookType depends on AuthorType and vice versa. 
 * The 'schema.js' is executed top-down while parsing. The dependend fields being wrapped inside
 * functions makes sure that each of them are invoked only when the dependend types are known.
 * 
 */

const graphql = require('graphql');
const _ = require('lodash');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema
} = graphql;

// Some dummy data
const books = [
  { name: 'The Art of Loving', genre: 'Philosophy', id: '1', authorid: '1' },
  { name: 'The Swarm', genre: 'Sci-Fi', id: '2', authorid: '2' },
  { name: 'The Wandering Earth', genre: 'Sci-Fi', id: '3', authorid: '3' },
  { name: 'Breaking News', genre: 'Krimi', id: '4', authorid: '2' },
  { name: 'Die Tyrannei des Schmetterlings', genre: 'Krimi', id: '5', authorid: '2' },
  { name: 'The Art of Being', genre: 'Philosophy', id: '6', authorid: '1' },
  { name: 'The Art of Listening', genre: 'Philosophy', id: '7', authorid: '1' },
  { name: 'The Three Body Problem', genre: 'Sci-Fi', id: '8', authorid: '3' }
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
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args){
        return _.find(authors, {id: parent.authorid });
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    rank: { type: GraphQLInt },
    country: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        return _.filter( books, {authorid: parent.id} );
      }
    }
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
    },

    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        return books;
      }
    },

    authors: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        return authors;
      }
    },

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
