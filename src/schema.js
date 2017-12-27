import {makeExecutableSchema, addMockFunctionsToSchema} from 'graphql-tools';

import {resolvers} from './resolvers';

const typeDefs = `
type UserPayload {
  username: String
  email: String
  token: String
  bio: String
  image: String
}

input UserRegisterInput {
  email: String
  password: String
  username: String
}

type Query {
  user(id: ID!): UserPayload
}

type Mutation {
  userRegister(user: UserRegisterInput!): UserPayload
  userLogin(email: String!, password: String!): UserPayload
}
`;

const schema = makeExecutableSchema({typeDefs, resolvers});
export { schema };
