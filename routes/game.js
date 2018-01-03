var express = require('express');
var router = express.Router();

module.exports= function(io){
  const HORIZONTAL = 1;
  const VERTICAL = 0;
  const ROWS = 10;
  const COLUMNS = 10;
  const WATER = 0;
  const SHIP = 1;
  const MISSED_SHOOT = -1;
  const HIT = 2;

  var board1 = new Array();
  var board2 = new Array();
  var player1;
  var player2;

io.on('connection', function(socket){
  socket.on('getPlayerID', function(data){
    if(player1 === 'undefined'){
      player1 = data.id;
      console.log(player1);
    }else{
      player2 = data.id;
      console.log(player2);
    }
  });
  socket.on('getBoard', function(board){

    getField(board);
    console.log(board);
  });
  socket.on('shoot', function(data){
  var x = data.x;
  var y = data.y;
  if(data.id == player1){
    if(board1[x][y] == SHIP){
      socket.emit('shootResult', true);
    }else{
      socket.emit('shootResult', false);
    }
  }else{
    if(board2[x][y] == SHIP){
      socket.emit('shootResult', true);
    }else{
      socket.emit('shootResult', false);
    }
  }

  });
});

function getField(board){
  if(player1 == board.id){
    board1 = board.board;
  }else{
    board2 = board.board;
  }
}

  return router;
}
