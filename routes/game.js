var express = require('express');
var router = express.Router();

module.exports= function(io){
  const WATER = 0;
  const SHIP = 1;
  const MISSED_SHOOT = -1;
  const HIT = 2;

  let board1;
  let board2;
  let player1 = 'undefined';
  let player2 = 'undefined';
  let playerName1;
  let playerName2;
  let currentPlayer;

io.on('connection', function(socket){

  socket.on('setPlayerID', function(data){
    if(player1 === 'undefined'){
      player1 = data.id;
      board1 = data.board;
      console.log(board1);
    }else if(player2 === 'undefined'){
      player2 = data.id;
      board2 = data.board;
      console.log(board2);
      io.sockets.emit('initalizeGameAndPlayer', {id1: player1, id2: player2, board1: board1, board2: board2});
    }

  });

  socket.on('setBoard', function(data){
    console.log(data);
    if(data.id == player1){
      board2 = data.board;
    }else if (data.id == player2){
      board1 = data.board
    }
    io.sockets.emit('updateOwnBoard', {id1: player1, id2: player2, board1: board1, board2: board2});
  });

  socket.on('turnChange', function(data){
    console.log('turnChange');
    if(data.id == player1){
      currentPlayer = player2;
      console.log('Player2 turn');
    }if(data.id == player2){
      currentPlayer = player1;
      console.log('Player1 turn');
    }
    io.sockets.emit('whosTurn', {id: currentPlayer});
  });
  socket.on('saveName', function(data){
    if(data.id == player1){
      playerName1 = data.name;
    }else if(data.id == player2){
      playerName2 = data.name;
    }
    if(playerName1 !== 'undefined' && playerName2 !== 'undefined'){
      io.sockets.emit('opponentName', {name1: playerName1, name2: playerName2});
    }

  });
});

function checkBoard(board, posX, posY){
  if(board[posX][posY] == SHIP){
    return true;
  }else{
    return false;
  }
}

    /*if(roundCounter%2 == 0){
      socket.emit('currentPlayer', {id: player1});
    }else{
      socket.emit('currentPlayer', {id: player2});
    }
    socket.on('setBoard', function(board){
      if(socketCounter % 2 != 0) {
        board1 = {id: player1, board: board.board};
        console.log("board1");
        console.log(board1);
      }if(socketCounter % 2 == 0){
        board2 ={id: player2, board: board.board};
        console.log("board2");
        console.log(board2);
      }
      //console.log(board);
        if(socketCounter % 2 != 0 && board2 !== 'undefined'){
          socket.emit('getOpponentBoard', {board: board2});
        }
        if(socketCounter % 2 == 0 && board1 !== 'undefined'){
          socket.emit('getOpponentBoard', {board: board1});
        }

  });*/


  /*socket.on('shoot', function(data){
  console.log(data);
  if(data.id == player1){
    if(board2[data.x][data.y] == SHIP){
      socket.emit('shootResult', true);
      console.log("Player1 " + true);
    }else{
      socket.emit('shootResult', false);
      console.log("Player1 " + false);
    }
  }else{
    if(board1[data.x][data.y] == SHIP){
      socket.emit('shootResult', true);
      console.log("Player2 " +true);
    }else{
      socket.emit('shootResult', false);
      console.log("Player2 " +false);
    }
  }
});*/
return router;
}
