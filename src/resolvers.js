import {user, userRegister} from './resolvers/users'

export const resolvers = {
  Query: {
    user
  },
  Mutation: {
    userRegister
  }
}
