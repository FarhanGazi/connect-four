import { mongoose } from "../../config/db"
import { User } from "./user"

var Schema = mongoose.Schema;

export interface Message extends Document {
  sender: User,
  receiver: User,
  message: string,
  created_at: Date,
  updated_at: Date
}

const message_schema = new Schema({
  sender: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  receiver: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  message: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  created_at: {
    type: mongoose.SchemaTypes.Date
  },
  updated_at: {
    type: mongoose.SchemaTypes.Date
  }
})