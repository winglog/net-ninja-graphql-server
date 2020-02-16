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

const Book = require('../models/book');
const Author = require('../models/author');

const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema
} = graphql;


const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    authorId: { type: GraphQLID },
    author: {
      type: AuthorType,
      resolve(parent, args){
        //return _.find(authors, {id: parent.authorId });
        return Author.findById( parent.authorId );
      }
    }
  })
});

const inputBookType = new GraphQLInputObjectType({
  name: 'BookInput',
  fields: {
    authorId: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString }
  }
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
        //return _.filter( books, {authorId: parent.id} );
        return Book.find( { authorId: parent.id } );
      }
    }
  })
});

const inputAuthorType = new GraphQLInputObjectType({
  name: 'AuthorInput',
  fields: {
    name: { type: GraphQLString },
    rank: { type: GraphQLInt },
    country: { type: GraphQLString }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {

    book: {
      type: BookType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args){
        // code to get data from database or other source
        //return _.find(books, { id: args.id });
        return Book.findById( args.id );
      }
    },

    /*
    The corresponding Query from Frontend looks like this:
    query {
      book(id: "1"){   // <-- Take care: This MUST be double-quotes in GraphiQL
        name,
        gernre
      }
    }
    */

    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args){
        // code to get data from database or other source
        //return _.find(authors, { id: args.id });
        return Author.findById( args.id );
      }
    },

    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        //return books;
        return Book.find({});
      }
    },

    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args){
        //return authors;
        return Author.find({});
      }
    },

  }
});

// Writing to the MongoDB:
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {

    addAuthor: {
      type: AuthorType,
      args: {
        input: {
          type: inputAuthorType
        },
      },
      resolve: function( parent, args ){
        let author = new Author({
          name: args.input.name,
          rank: args.input.rank,
          country: args.input.country
        });
        return author.save();
      }
    },

    addBook: {
      type: BookType,
      args: {
        input: {
          type: inputBookType
        },
      },
      resolve: function( parent, args ){
        let book = new Book({
          name: args.input.name,
          authorId: args.input.authorId,
          genre: args.input.genre
        });
        return book.save();
      }
    },

  }
});

module.exports = new GraphQLSchema({
  query: RootQuery, // <-- This tells us how we initially jump into the graph!
  mutation: Mutation
});
