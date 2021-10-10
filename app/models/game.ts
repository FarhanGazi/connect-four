import { mongoose } from "../../config/db";
import { User } from "./user";

var Schema = mongoose.Schema;

export interface Game extends Document {
  status: string,
  table: any[][],
  type: string,
  player1: User,
  player2: User,
  turn: User,
  make_move: (player_id: string, row: number, col: number) => boolean,
  terminate: () => boolean,
  add_player: (player_id: string) => boolean
}

const game_schema = new Schema({
  status: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  table: {
    type: [[mongoose.SchemaTypes.Any]],
    required: true
  },
  type: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  player1: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  player2: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  turn: {
    type: mongoose.SchemaTypes.String
  }
});

game_schema.methods = {
  make_move: function (player: string, row: number, col: number): boolean {
    console.log(this.turn);
    console.log(player);
    return false;
  },

  terminate: function (): boolean {
    return false;
  },

  add_player: function (player_id: string): boolean {
    // TODO:
    // 1) chech if game allows to add user
    // 2) fetch user from DB
    // 3) add user to game
    // return true only if user is added
    return false;
  }
}

var game_model;

export function get_schema() { return game_schema; }

export function get_model() {
  if (!game_model){
    game_model = mongoose.model('Game', get_schema());
  }
  return game_model;
}

export function new_game(data: {type: String}) {
  var table: any[][] = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ];
  var _gamemodel = get_model();
  var game = new _gamemodel({
    status: 'created',
    table: table,
    type: data.type,

  });

  return game;
}