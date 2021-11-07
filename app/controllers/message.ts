import * as Message from '../models/message'
import * as User from '../models/user'
import { users } from '../helpers/socket'

export function send(req, res, next) {
  let user = req.user || {};
  let params = req.body || {};

  User.get_model().find({ _id: { $in: [user.id, params.receiver] } })
    .then((users_list) => {
      let sender = users_list[0];
      let receiver = users_list[1];
      let new_message = Message.new_message({
        sender: sender,
        receiver: receiver,
        message: params.message,
        timestamp: new Date()
      });

      new_message.save().then(function (result) {
        let usocket = users[receiver._id];
        if (usocket != undefined) {
          // Emit game events on its channel
          usocket.send(new_message);
          return res.status(200).json({ error: false, errormessage: "", message: new_message, result: result });
        } else {
          next({ statusCode: 404, error: true, errormessage: "WSS NOT FOUND!", result: result });
        }
      }).catch((error) => {
        next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
      })
    })
}

export function get(req, res, next) {
  let params = req.body || {};

  Message.get_model().findOne(params).then((message) => {
    return res.status(200).json(message);
  }).catch((error) => {
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}

export function search(req, res, next) {
  let user = req.user || {};
  let params = req.body || {};

  Message.get_model().find({ receiver: { $in: [user.id, params.user_id] }, sender: { $in: [user.id, params.user_id] } })
    .sort({ timestamp: 1 }).then((response) => {
      return res.status(200).json(response);
    }).catch((error) => {
      next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
    });
}