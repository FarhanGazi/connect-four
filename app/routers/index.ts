import express = require('express');
import * as user from '../models/user'

var indexRouter = express.Router();
// GET home page.
indexRouter.get('/', (req, res) => {
  var u = user.new_user({
    username: "admin",
    email: "admin@postmessages.it"
  });
  u.set_password("admin");
  u.set_admin();
  u.save().then(function () {
    console.log('FATTO!');
  }).catch(function (error) {
    console.log(error);
  });
  res.status(200).json({ api_version: "1.0", endpoints: ["/auth", "/users", "/games", "/chat"] });
});

export { indexRouter }