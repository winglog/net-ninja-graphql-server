const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    hello(name: String!): String!
  }

  type User {
    id: ID!
    username: String!
  }

  input UserInfo {
    username: String!
    password: String!
    age: Int
  }

  type Error {
    field: String!
    message: String!
  }

  type RegisterResponse {
    errors: [Error]
    user: User!
  }

  type Mutation {
    register(userInfo: UserInfo!): RegisterResponse!
    login(userInfo: UserInfo!): String!
  }
`;


const checkPassword = () => {
  return new Promise((resolve) =>{
    console.log('Checking Password...');
    setTimeout(function() {
      console.log('Password checked.');
      resolve();
    }, 3000);
  });
};

const resolvers = {

  // How GraphQL Resolvers Work:

  Query: {
    hello: (parent, {name}) => {
      return `Hello ${name}!`;
    }
  },

  Mutation: {
    // Get userInfo.username from the input parameter by deep destructuring of the argument
    // args in (parent, args, context, info):
    login: async (parent, {userInfo: {username, password}}, context, info) => {
      // console.log(context);
      await checkPassword(password);
      console.log('Logging in ' + username);
      return username;
    },

    register: () => ({
      user: {
        id: 1,
        username: "Bob"
      },
      errors: [{
        field: "username",
        message: "missing"
      },{
        field: "id",
        message: "missing"
      }]
    })

  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res })
});
server.listen(3333).then( ({url}) => {
  console.log(`Listening ${url}`);
});
