import * as Message from '../models/message'
import * as User from '../models/user'
import { users } from '../helpers/socket'

export function send(req, res, next) {
  let user = req.user || {};
  let params = req.body || {};

  console.log(user);
  console.log(params);

  User.get_model().find({ _id: { $in: [user.id, params.receiver] } })
    .then((users) => {
      console.log(users);
      let sender = users[0];
      let receiver = users[1];
      console.log(sender);
      console.log(receiver);
      let new_message = Message.new_message({
        sender: sender,
        receiver: receiver,
        message: params.message,
        timestamp: new Date()
      });

      console.log(new_message);

      new_message.save().then(function (result) {
        let usocket = users[receiver._id];
        if (usocket != undefined) {
          // Emit game events on its channel
          usocket.send(new_message);
          return res.status(200).json({ error: false, errormessage: "", message: new_message });
        } else {
          next({ statusCode: 404, error: true, errormessage: "WSS NOT FOUND!" });
        }
      }).catch((error) => {
        next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
      })
    })
}