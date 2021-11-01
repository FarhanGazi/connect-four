import express = require('express')
import * as authHelper from '../helpers/auth'
import * as messageController from '../controllers/message'

var messageRouter = express.Router();

messageRouter.post("/send", authHelper.auth, messageController.send);

export { messageRouter }