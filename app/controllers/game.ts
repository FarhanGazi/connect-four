import * as Game from '../models/game'
import * as User from '../models/user'

export function create(req, res, next) {
  let new_game = Game.new_game();

  new_game.save().then((response) => {
    return res.status(200).json({ error: false, errormessage: "", game: new_game, response: response });
  }).catch((error) => {
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}

export function search(req, res, next) {
  let params = req.body || {};

  Game.get_model().find(params).then((games) => {
    return res.status(200).json(games);
  }).catch((error) => {
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}

export function get(req, res, next) {
  let params = req.body || {};

  Game.get_model().findOne(params).then((game) => {
    return res.status(200).json(game);
  }).catch((error) => {
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}

export function update(req, res, next) {
  let params = req.body || {};
  let query = params.query || {};
  let data = params.data || {};

  Game.get_model().updateOne(query, data).then((response) => {
    return res.status(200).json(response);
  }).catch((error) => {
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}

export function terminate(req, res, next) {
  let params = req.body || {};

  Game.get_model().findOne(params).then((game) => {
    if (game.terminate()) {
      return res.status(200).json(game);
    } else {
      next({ statusCode: 400, error: true, errormessage: "BAD Request" });
    }
  }).catch((error) => {
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}

export function add_player(req, res, next) {
  let params = req.body || {};
  let game_id      = params.game_id;
  let player_email = params.player_email;

  User.get_model().findOne({ email: player_email })
    .then((u) => {
      return u;
    })
    .then((u) => {
      if (u) {
        Game.get_model().findOne({ _id: game_id }).then((game) => {
          if (game.add_player(u)) {
            game.save().then((response) => {
              return res.status(200).json({ response: response, game: game });
            }).catch((error) => {
              next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
            })
          } else {
            next({ statusCode: 400, error: true, errormessage: "BAD Request: failed to add player to game!" });
          }
        })
      } else {
        next({ statusCode: 404, error: true, errormessage: "NOT FOUND: player not found!" });
      }
    }).catch((error) => {
      next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
    });
}

export function add_me(req, res, next) {
  let user = req.user;
  let game_id = req.body.game_id;

  User.get_model().findOne({ email: user.email })
    .then((u) => {
      return u;
    })
    .then((u) => {
      if (u) {
        Game.get_model().findOne({ _id: game_id }).then((game) => {
          if (game.add_player(u)) {
            game.save().then((response) => {
              return res.status(200).json({ response: response, game: game });
            }).catch((error) => {
              next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
            })
          } else {
            next({ statusCode: 400, error: true, errormessage: "BAD Request: failed to add player to game!" });
          }
        })
      } else {
        next({ statusCode: 404, error: true, errormessage: "NOT FOUND: player not found!" });
      }
    }).catch((error) => {
      next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
    });
}

export function make_move(req, res, next) {
  let params = req.body || {};
  let game_id = params.game_id;

  Game.get_model().findOne({ _id: game_id }).then((game) => {
    console.log(game);
    if (game) {
      if (game.make_move(params.player_id, params.row, params.col)) {
        Game.get_model().updateOne({ _id: game_id }, game ).then((response)=>{
          console.log(game.table);
          return res.status(200).json(response);
        }).catch((error)=>{
          next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
        })
      } else {
        next({ statusCode: 400, error: true, errormessage: "BAD Request" });
      }
    } else {
      next({ statusCode: 400, error: true, errormessage: "BAD Request" });
    }
  }).catch((error) => {
    next({ statusCode: 500, error: true, errormessage: "DB error: " + error });
  });
}