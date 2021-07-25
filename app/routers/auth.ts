import express = require('express');
import jsonwebtoken = require('jsonwebtoken');
import * as auth from '../helpers/auth'

var authRouter = express.Router();
authRouter.get("/login", auth.passport.authenticate('basic', { session: false }), (req, res, next) => {

  var tokendata = {
    username: req.user["username"],
    roles: req.user["roles"],
    email: req.user["email"],
    id: req.user["id"]
  };

  console.log(tokendata);

  var token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log("Login granted. Generating token");

  return res.status(200).json({ error: false, errormessage: "", token: token_signed });
});

export { authRouter }