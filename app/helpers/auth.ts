import passport = require('passport');
import passportHTTP = require('passport-http');
import jwt = require('express-jwt');

import * as user from '../models/user'

var auth = jwt({ secret: process.env.JWT_SECRET });

passport.use(new passportHTTP.BasicStrategy(
  function (username, password, done) {
    console.log("New login attempt from " + username);
    user.get_model().findOne({ email: username }, (err, user) => {
      console.log(user);

      if (user.validate_password(password)) {
        return done(null, user);
      }

      if (err) {
        return done({ statusCode: 500, error: true, errormessage: err });
      }

      if (!user) {
        return done(null, false, { statusCode: 500, error: true, errormessage: "Invalid user" });
      }


      return done(null, false, { statusCode: 500, error: true, errormessage: "Invalid password" });
    })
  }
));

export { auth, passport }