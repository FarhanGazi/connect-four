import { mongoose } from "../../config/db"
import { User } from "./user"

var Schema = mongoose.Schema;

export interface Message extends Document {
  sender: User,
  receiver: User,
  message: string,
  timestamp: Date
}

const message_schema = new Schema({
  sender: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  timestamp: {
    type: mongoose.SchemaTypes.Date,
    required: true
  }
})

export function get_schema() { return message_schema; }

var messageModel;
export function get_model() {
  if (!messageModel) {
    messageModel = mongoose.model('Message', get_schema());
  }
  return messageModel;
}

export function new_message(data: { sender: User, receiver: User, message: string, timestamp: Date }) {
  var _messagemodel = get_model();
  var message = new _messagemodel(data);

  return message;
}