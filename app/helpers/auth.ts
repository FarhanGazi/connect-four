import passport = require('passport');
import passportHTTP = require('passport-http');
import jwt = require('express-jwt');

import * as user from '../models/user'

var auth = jwt({ secret: process.env.JWT_SECRET });

passport.use(new passportHTTP.BasicStrategy(
  function (username, password, done) {
    user.get_model().findOne({ email: username }, (err, user) => {
      console.log(err);
      console.log(user);

      if (err) {
        return done({ statusCode: 500, error: true, errormessage: err });
      }

      if (!user) {
        return done(null, false, { statusCode: 404, error: true, errormessage: "User not found" });
      }

      if (user.validate_password(password)) {
        return done(null, user);
      }

      return done(null, false, { statusCode: 400, error: true, errormessage: "Invalid password" });
    })
  }
));

var isAdmin = function (req, res, next) {
  let user = req.user;
  if(user && user.roles.indexOf('admin') >= 0){
    next();
  } else {
    next({ statusCode: 403, error: true, errormessage: "FORBIDDEN" });
  }
}

var isPlayer = function(req, res, next) {
  let user = req.user;
  if (user && user.roles.indexOf('player') >= 0) {
    next();
  } else {
    next({ statusCode: 403, error: true, errormessage: "FORBIDDEN" });
  }
}

export { auth, passport, isAdmin, isPlayer }