import * as game from '../models/game'

export function create(req, res, next) {
  let new_game = game.new_game(req.body);

  new_game.save().then((response) => {
    return res.status(200).json({ error: false, errormessage: "", game: new_game, response: response });
  }).catch((error) => {
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}

export function search(req, res, next) {
  let params = req.body || {};

  game.get_model().find(params).then((games) => {
    return res.status(200).json(games);
  }).catch((error) => {
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}

export function get(req, res, next) {
  let params = req.body || {};

  game.get_model().findOne(params).then((game) => {
    return res.status(200).json(game);
  }).catch((error) => {
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}

export function update(req, res, next) {
  let params = req.body || {};
  let query = params.query || {};
  let data = params.data || {};

  game.get_model().updateOne(query, data).then((response) => {
    return res.status(200).json(response);
  }).catch((error) => {
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}

export function terminate(req, res, next) {
  let params = req.body || {};

  game.get_model().findOne(params).then((game) => {
    if (game.terminate()){
      return res.status(200).json(game);
    } else {
      next({ statusCode: 400, error: true, errormessage: "BAD Request" });
    }
  }).catch((error)=>{
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}

export function add_player(req, res, next) {
  let params = req.body || {};

  game.get_model().findOne(params).then((game) => {
    if (game.add_player(params.player_id)) {
      return res.status(200).json(game);
    } else {
      next({ statusCode: 400, error: true, errormessage: "BAD Request" });
    }
  }).catch((error) => {
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}

export function make_move(req, res, next) {
  let params = req.body || {};

  game.get_model().findOne(params).then((game) => {
    if (game.make_move(params.player_id, params.row, params.col)) {
      return res.status(200).json(game);
    } else {
      next({ statusCode: 400, error: true, errormessage: "BAD Request" });
    }
  }).catch((error) => {
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}