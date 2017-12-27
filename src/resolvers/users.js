import User from '../models/User';
import passport from 'passport';

const userLogin = (root, args, context) => {

  return new Promise((resolve, reject) => {

    const {email, password} = args;

    if (!email || !password) {
      reject("Credentials can't be blank.")
    }

  })

}

const userRegister = (root, args, context) => {

  return new Promise((resolve, reject) => {

    const {user: {email, password, username}} = args;

    let user = new User();

    user.username = username;
    user.email = email;
    user.setPassword(password);

    user.save((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(user.toAuthJSON())
      }
    })
  })

}

const user = (root, args, context) => {
  const {id} = args

  return new Promise((resolve, reject) => {

    User.findById(id, (err, user) => {
      if (err) {
        reject(err);

      } else {
        if(!user) {
          return null;
        }

        resolve(user.toAuthJSON());

      }
    })
  })

}

export {user, userRegister, userLogin}