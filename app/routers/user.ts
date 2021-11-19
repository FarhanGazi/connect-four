import express = require('express');
import { upload } from '../../config/multer';
import * as authHelper from '../helpers/auth';
import * as userController from '../controllers/user';

var userRouter = express.Router();

userRouter.post("/create", authHelper.auth, userController.create);

userRouter.post("/upload_image", authHelper.auth, upload.single('image'), userController.uploadImage);

userRouter.post("/search", authHelper.auth, userController.search);

userRouter.get("/get", authHelper.auth, userController.get);

userRouter.get("/update", authHelper.auth, userController.update);

userRouter.get("/delete", authHelper.auth, userController.destroy);

export { userRouter }