import express = require('express');
import * as authHelper from '../helpers/auth'
import * as userController from '../controllers/user'

var userRouter = express.Router();

userRouter.post("/create", authHelper.auth, userController.create);

userRouter.post("/search", userController.search);

export { userRouter }