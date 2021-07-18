const result = require('dotenv').config()

var db_driver = process.env.DB_DRIVER;
var db_host = process.env.DB_HOST;
var db_port = process.env.DB_PORT;
var db_name = process.env.DB_NAME;

export function db_path() {
  return `${db_driver}://${db_host}:${db_port}/${db_name}`;
}