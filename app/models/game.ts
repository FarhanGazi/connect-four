import { mongoose } from "../../config/db";
import { User } from "./user";

var Schema = mongoose.Schema;

export interface Game extends Document {
  status: string,
  table: any[][],
  type: string, // simple, ai
  player1: User,
  player2: User,
  winner: User,
  turn: User,
  make_move: (player_id: string, row: number, col: number) => boolean,
  terminate: () => boolean,
  add_player: (player: User) => boolean
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

  __drop: function name(index, index2) {
    var that = this;
    if (this.table[index][index2] === 0) {
      this.table[0][index2] = this.turn;
      (function dropLoop(i) {
        setTimeout(function () {
          if (typeof that.table[i] !== 'undefined' && that.table[i][index2] === 0 && i <= 5) {
            that.table[i - 1][index2] = 0;
            that.table[i][index2] = that.turn;
            dropLoop(i + 1);
          } else {
            that.turn = (that.turn == 'r' ? 'y' : 'r');
            this.status = 'active';
            this.winner = this.__winDetect();
            if (this.winner) {
              this.status = 'ended';
            }
            if (this.type == 'ai' && this.status == 'active') {
              this.__ai();
            }
          }
        }, 50);
      })(1);
    }
  },

  terminate: function (): boolean {
    return false;
  },

  add_player: function (player: User): boolean {
    if (this.type == 'simple'){
      if (this.player1 == undefined){
        this.player1 = player;
      } else if (this.player2 == undefined){
        this.player2 = player;
      } else {
        return false;
      }
    } else if (this.type == 'ai') {
      if (this.player1 == undefined){
        this.player1 = player;
      } else {
        return false
      }
    } else {
      return false;
    }
    return true;
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