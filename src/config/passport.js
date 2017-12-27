import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../models/User';

const setLocalStrategy = () => {
  passport.use(new LocalStrategy.Strategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    console.log("email", email);
    console.log("password", password);
    User.findOne({email: email}).then((user) => {
      if(!user || !user.validPassword(password)){
        return done(null, false, {errors: {'email or password': 'is invalid'}});
      }
      console.log("user", user);
      return done(null, user);
    }).catch(done);

  }));
}

export default setLocalStrategy