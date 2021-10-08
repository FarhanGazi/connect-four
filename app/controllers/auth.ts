import jsonwebtoken = require('jsonwebtoken');
import * as user from '../models/user'

export function login(req, res, next) {

  let tokendata = {
    username: req.user["username"],
    roles: req.user["roles"],
    email: req.user["email"],
    id: req.user["id"]
  };

  console.log(tokendata);

  let token_signed = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log("Login granted. Generating token");

  return res.status(200).json({ error: false, errormessage: "", token: token_signed });
}

export function signup(req, res, next) {
  let username = req.body.user.username;
  let email = req.body.user.email;
  let password = req.body.user.password;

  let new_user = user.new_user({ username: username, email: email });
  new_user.set_password(password);

  new_user.save().then(function () {
    return res.status(200).json({ error: false, errormessage: "", user: new_user });
  }).catch(function (error) {
    console.error(error);
    return res.status(400).json({ error: true, errormessage: "BAD REQUEST" });
  });
}