import express = require('express');

import  { indexRouter } from './routers/index';

export function create_app() {
  var app = express();

  app.use('/', indexRouter);

  return app;
}