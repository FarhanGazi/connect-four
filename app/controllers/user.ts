import fs = require('fs');
import path = require('path');

import * as user from '../models/user'

export function create(req, res, next) {
  let params = req.body || {};
  let password = params.password || "pass";

  let new_user = user.new_user(params);
  new_user.set_password(password);

  new_user.save().then(function () {
    return res.status(200).json({ error: false, errormessage: "", user: new_user });
  }).catch(function (error) {
    console.error(error);
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}

export function uploadImage(req, res, next) {
  console.log(req.body);
  console.log(req.file);
  console.log(req.params);
  let params = req.body || {};
  let id = params.id;
  let file = req.file;
  let query = params.query;

  user.get_model().findOne({ _id: id }).then((user) => {
    user["img"] = {
      data: fs.readFileSync(path.join(__dirname + '/uploads/' + file.filename)),
      contentType: 'image/png'
    };
    console.log(user);
    user.get_model().undateOne(query, user).then((response) => {
      return res.status(200).json(response);
    }).catch((error) => {
      next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
    });
  });
}

export function search(req, res, next) {
  let params = req.body || {};

  user.get_model().find(params).then((users) => {
    return res.status(200).json(users);
  }).catch((error) => {
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}

export function get(req, res, next) {
  let params = req.body || {};

  user.get_model().findOne(params).then((user) => {
    return res.status(200).json(user);
  }).catch((error) => {
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}

export function update(req, res, next) {
  let params = req.body || {};
  let query = params.query || {};
  let data = params.data || {};

  user.get_model().updateOne(query, data).then((response) => {
    return res.status(200).json(response);
  }).catch((error) => {
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}

export function destroy(req, res, next) {
  let params = req.body || {};

  user.get_model().deleteOne(params).then((response) => {
    return res.status(200).json(response);
  }).catch((error) => {
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}