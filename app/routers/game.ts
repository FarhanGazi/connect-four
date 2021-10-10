import express = require('express');
import * as authHelper from '../helpers/auth'
import * as gameController from '../controllers/game'

var gameRouter = express.Router();

gameRouter.post("/create", authHelper.auth, gameController.create);
gameRouter.post("/search", authHelper.auth, gameController.search);
gameRouter.post("/get", authHelper.auth, gameController.get);
gameRouter.post("/update", authHelper.auth, gameController.update);
gameRouter.post("/terminate", authHelper.auth, gameController.terminate);
gameRouter.post("/make_move", authHelper.auth, gameController.make_move);
gameRouter.post("/add_player", authHelper.auth, gameController.add_player);

export { gameRouter }