import {user, userRegister, userLogin} from './resolvers/users'

export const resolvers = {
  Query: {
    user
  },
  Mutation: {
    userRegister,
    userLogin
  }
}
