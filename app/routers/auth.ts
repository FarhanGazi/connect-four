import express = require('express');
import * as authHelper from '../helpers/auth'
import * as authController from '../controllers/auth'

var authRouter = express.Router();

authRouter.get("/login", authHelper.passport.authenticate('basic', { session: false }), authController.login);

authRouter.post("/signup", authController.signup);

export { authRouter }