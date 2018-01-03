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

  var board1;
  var board2;
  var player1;
  var player2;

io.on('connection', function(socket){
  socket.on('getBoard', function(board){

    getField(board);
    console.log(board);
  });
  socket.on('shoot', function(data){
    console.log(data);
  });
});

function getField(board){
  if(board.name == "myBoard"){
    board1 = board;
  }else{
    board2 = board;
  }
}






  return router;
}
