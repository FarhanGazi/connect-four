import express = require('express')
import * as authHelper from '../helpers/auth'
import * as messageController from '../controllers/message'

var messageRouter = express.Router();

messageRouter.get("/get", authHelper.auth, messageController.get);
messageRouter.post("/send", authHelper.auth, messageController.send);
messageRouter.post("/search", authHelper.auth, messageController.search);

export { messageRouter }