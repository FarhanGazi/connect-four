import { join } from "path";
import { mongoose } from "../../config/db";
import { User } from "./user";

var Schema = mongoose.Schema;

export interface Game extends Document {
  status: string,
  table: any[][],
  type: string, // simple, ai
  player1: User,
  player2: User,
  winner: any,
  active: string,
  dropAllowed: any,
  aiComments: string[],
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
  winner: {
    type: mongoose.SchemaTypes.String
  },
  active: {
    type: mongoose.SchemaTypes.String
  },
  dropAllowed: {
    type: mongoose.SchemaTypes.Boolean
  },
  aiComments: {
    type: [mongoose.SchemaTypes.String]
  }
});

game_schema.methods = {
  make_move: function (player_id: string, row: number, col: number): boolean {
    console.log(this.turn);
    console.log(player_id);
    return false;
  },

  __drop: function (index, index2) {
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

  __winDetect: function name() {
    var tempWinner = undefined;
    //horiz
    for (var i = 0; i < this.table.length; i++) {
      var rowMatch = this.table[i].join('').match(/r{4}|y{4}/);
      if (rowMatch) {
        rowMatch[0].indexOf("r") > -1 ? tempWinner = "red" : tempWinner = "yellow";
      }
    }
    //vertical
    var columns = this.__getColumns();
    for (var j = 0; j < columns.length; j++) {
      var colMatch = columns[j].join('').match(/r{4}|y{4}/);
      if (colMatch) {
        colMatch[0].indexOf("r") > -1 ? tempWinner = "red" : tempWinner = "yellow";
      }
    }
    //diag
    var diags = this.__getDiags();
    for (var l = 0; l < diags.length; l++) {
      var diagMatch = diags[l].join('').match(/r{4}|y{4}/);
      if (diagMatch) {
        diagMatch[0].indexOf("r") > -1 ? tempWinner = "red" : tempWinner = "yellow";
      }
    }
    return tempWinner;
  },

  __getColumns: function () {
    var columns = [];
    for (var j = 0; j < this.table[0].length; j++) {
      var column = [];
      for (var k = 0; k < this.table.length; k++) {
        column.push(this.table[k][j]);
      }
      columns.push(column);
    }
    return columns;
  },

  __getDiags: function (arr) {
    if (typeof arr === 'undefined') arr = this.table;
    var diags = [];
    for (var i = -5; i < 7; i++) {
      var group = [];
      for (var j = 0; j < 6; j++) {
        if ((i + j) >= 0 && (i + j) < 7) {
          group.push(arr[j][i + j]);
        }
      }
      diags.push(group);
    }
    for (i = 0; i < 12; i++) {
      var group = [];
      for (var j = 5; j >= 0; j--) {
        if ((i - j) >= 0 && (i - j) < 7) {
          group.push(arr[j][i - j]);
        }
      }
      diags.push(group);
    }
    return diags.filter(function (a) {
      return a.length > 3;
    });
  },

  __ai: function () {
    var that = this;
    var decision = null;
    var responseType = null;
    function threatDetect(lt, type) {
      //vertical threat assessment & response
      var columns = that.__getColumns();
      for (var i = 0; i < columns.length; i++) {
        var vertMatch;
        type == 'major' ? vertMatch = "0" + lt + lt + lt : vertMatch = "00" + lt + lt;
        var colMatch = columns[i].join('').match(vertMatch);
        if (colMatch) {
          decision = i;
          console.log('ai: responding to a ' + type + ' vertical ' + responseType);
          that.aiComments.push('ai: responding to a ' + type + ' vertical ' + responseType);
        }
      }

      if (!decision) {
        //horiz threat assessment & response
        var horizThreatPatterns;
        if (type == 'major') {
          horizThreatPatterns = ['0' + lt + lt + lt, lt + '0' + lt + lt, lt + lt + '0' + lt, lt + lt + lt + '0'];
        } else {
          horizThreatPatterns = ['00' + lt + lt, '0' + lt + lt + '0', '0' + lt + '0' + lt, lt + '0' + lt + '0', '0' + lt + lt + '0', lt + lt + '00'];
        }

        for (i = 0; i < that.table.length; i++){
          var found  = [];
          var joined = that.table[i].join('');
          for (var j = 0; j < horizThreatPatterns; j++) {
            var match = joined.match(horizThreatPatterns[j]);
            if (match) found.push(match[0]);
          }
          if (found.length) {
            var testCase = 0;
            if (i == that.table.length - 1) {
              if (found[0] == '00yy' || found[0] == '00rr') testCase = 1;
              decision = joined.indexOf(found[0]) + found[0].indexOf('0') + testCase;
              console.log('ai: responding to a ' + type + ' horizontal ' + responseType);
              that.aiComments.push('ai: responding to a ' + type + ' horizontal ' + responseType);
            } else {
              var matchPosition = joined.indexOf(found[0]) + found[0].indexOf('0');
              if (found[0] == '00yy' || found[0] == '00rr') matchPosition++;
              if (that.table[i + 1][matchPosition] !== 0) {
                decision = matchPosition;
                console.log('ai: responding to a ' + type + ' horizontal ' + responseType);
                that.aiComments.push('ai: responding to a ' + type + ' horizontal ' + responseType);
              }
            }
          }
        }
      }

      if (!decision) {
        //diag threat assessment & response
        var diags = that.__getDiags();
        var diagThreatPatterns = ['0' + lt + lt + lt, lt + '0' + lt + lt, lt + lt + '0' + lt, lt + lt + lt + '0'];
        for(i = 0; i < diags.length; i++){
          var found  = [];
          var joined = diags[i].join('');
          for(var j = 0; j < diagThreatPatterns.length; j++) {
            var match = joined.match(diagThreatPatterns[j]);
            if (match) found.push(match[0]);
          }
          if (found.length) {
            for (var l = 0; l < found.length; l++) {
              var diagMap = that.__getDiags([[0, 1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12, 13], [14, 15, 16, 17, 18, 19, 20], [21, 22, 23, 24, 25, 26, 27], [28, 29, 30, 31, 32, 33, 34], [35, 36, 37, 38, 39, 40, 41]]);
              var vulnSlot = diagMap[i][found[l].indexOf('0')];
              if (typeof that.table[Math.floor(vulnSlot / 7) + 1] === 'undefined' || that.table[Math.floor(vulnSlot / 7) + 1][(vulnSlot % 7)] !== 0) {
                decision = vulnSlot % 7;
                console.log('ai: responding to a ' + type + ' diagonal ' + responseType);
                that.aiComments.push('ai: responding to a ' + type + ' diagonal ' + responseType);
              }
            }
          }
        }
      }
    }

    function opportunityDetect(type) {
      //detecting our opportunities is just like detecting threats (mostly, 3 extra patterns)
      //we want to be defensive over offensive, so we only look for opportunities
      //if there are no immediate threats
      responseType = 'opportunity';
      threatDetect(that.active, type);
    }

    //look for winning opportunities
    opportunityDetect('major');

    //if none, look for major threats
    if (decision === null) {
      responseType = 'threat';
      threatDetect((that.active == 'r' ? 'y' : 'r'), 'major');
    }

    //if none look for minor opportunities
    if (decision === null) {
      opportunityDetect('minor');
    }

    //if none look for minor threats
    if (decision === null) {
      responseType = 'threat';
      threatDetect((that.active == 'r' ? 'y' : 'r'), 'minor');
    }

    if (decision !== null && that.table[0][decision] === 0) {
      that.__drop(0, decision);
    } else {
      console.log('ai: no threats or opportunities found, goin random');
      var random = Math.floor(Math.random() * 7);
      var failSafe = 0;
      var boardValue = that.table[0][random];
      while (boardValue !== 0 && failSafe < 100) {
        random = Math.floor(Math.random() * 7);
        boardValue = that.table[0][random];
        failSafe++;
      }
      that.__drop(0, random);
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
    active: 'r',

  });

  return game;
}