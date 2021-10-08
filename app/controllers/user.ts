import * as user from '../models/user'

export function create(req, res, next) {
  let params = req.body;

  let new_user = user.new_user(params.user);
  new_user.set_password(params.user.params);

  new_user.save().then(function () {
    return res.status(200).json({ error: false, errormessage: "", user: new_user });
  }).catch(function (error) {
    console.error(error);
    return res.status(400).json({ error: true, errormessage: "BAD REQUEST" });
  });
}

export function search(req, res, next) {
  let params = req.body;

  user.get_model().find({}).then((users) => {
    return res.status(200).json(users);
  }).catch((error) => {
    next({ statusCode: 404, error: true, errormessage: "DB error: " + error });
  });
}