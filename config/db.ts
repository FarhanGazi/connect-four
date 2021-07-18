import { db_path } from './config'

var mongoose = require('mongoose');

export function db_connect() {
  return mongoose.connect(db_path(), { useNewUrlParser: true, useUnifiedTopology: true });
}

export { mongoose }