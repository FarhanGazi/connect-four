import express = require('express');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import createError = require('http-errors');
import bodyparser = require('body-parser');
import cors = require('cors');

import { nextTick } from 'process';

import { db_connect, mongoose } from '../config/db';

import { indexRouter } from './routers/index';
import { authRouter } from './routers/auth';
import { userRouter } from './routers/user';

export function create_app() {
  var app = express();
  //app.set('view engine', 'pug');

  var db;
  db_connect()
    .then(() => {
      db = mongoose.connection;
      db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    }).catch((e) => {
      console.error(e);
    });

  app.use(cors());
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use('/', indexRouter);
  app.use('/auth', authRouter);
  app.use('/user', userRouter);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(createError(404));
  });

  // error handler
  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({ error: err });
  });

  return app;
}