var express = require("express");
var router = express.Router();

module.exports= function(io){
    const WATER = 0;
    const SHIP = 1;
    const MISSED_SHOOT = -1;
    const HIT = 2;
    const ROWS = 10;
    const COLUMNS = 10;

    let board1;
    let board2;
    let player1 = "undefined";
    let player2 = "undefined";
    let playerName1;
    let playerName2;
    let currentPlayer;

    io.on("connection", function(socket){

        socket.on("setPlayerID", function(data){
            if(player1 === "undefined"){
                player1 = data.id;
                board1 = data.board;
                console.log(board1);
            }else if(player2 === "undefined"){
                player2 = data.id;
                board2 = data.board;
                console.log(board2);
                io.sockets.emit("initalizeGameAndPlayer", {id1: player1, id2: player2, board1: board1, board2: board2});
            }

        });

        socket.on("setBoard", function(data){
            console.log(data);
            if(data.id == player1){
                board2 = data.board;
            }else if (data.id == player2){
                board1 = data.board;
            }
            io.sockets.emit("updateOwnBoard", {id1: player1, id2: player2, board1: board1, board2: board2});

            // Player 1 won
            if(winner(board2)){
                io.sockets.emit("winner",{id: player1});
            }
            // Player2 won
            if(winner(board1)){
                io.sockets.emit("winner",{id: player2});
            }

        });

        socket.on("turnChange", function(data){
            console.log("turnChange");
            if(data.id == player1){
                currentPlayer = player2;
                console.log("Player2 turn");
            }if(data.id == player2){
                currentPlayer = player1;
                console.log("Player1 turn");
            }
            io.sockets.emit("whosTurn", {id: currentPlayer});
        });
        socket.on("saveName", function(data){
            if(data.id == player1){
                playerName1 = data.name;
            }else if(data.id == player2){
                playerName2 = data.name;
            }
            if(playerName1 !== "undefined" && playerName2 !== "undefined"){
                io.sockets.emit("opponentName", {name1: playerName1, name2: playerName2});
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

    // check if all ships at the opponent Board are hitted
    function winner(board){
        for(let i = 0; i < COLUMNS; i++){
            for(let j = 0; j < ROWS; j++){
                if(board[i][j] == SHIP){
                    return false;
                }
            }
        }
        return true;
    }

    return router;
};
