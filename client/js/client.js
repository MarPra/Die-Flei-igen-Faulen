//----------------------------GLOBAL VARIABLES---------------------------------

const HORIZONTAL = 1;
const VERTICAL = 0;
const ROWS = 10;
const COLUMNS = 10;
const WATER = 0;
const SHIP = 1;
const MISSED_SHOOT = -1;
const HIT = 2;
let myBoard = createField();
let opponentBoard = createField();
console.log(myBoard);
const socket =  io();
const playerID = getRandomInt(1000, 999999);
let shootsCounter = 0;
let myTurn;
const view = new View();
const highscore = new Highscore();
let inGame;
let playerName;
let opponentName;
const apiURL = "http://localhost:3000/api/";
let ships = [
    {name: "battleship" , length: 5, amount: 1},
    {name: "cruiser" , length: 4 , amount: 2},
    {name: "destroyer" , length: 3 , amount: 3},
    {name: "submarine" , length: 2 , amount: 4}
];

function initalize(){
    inGame = true;
    highscore.getHighscore();
    setPlayerID();
    setShipsRandomly(myBoard);
    initalizeGameAndPlayer();
    view.showPlayerModal();
    view.updateTables(shootsCounter,myTurn, myBoard, opponentBoard);
}



// Listener for Server Events to realize Realtime
socket.on("whosTurn", function(data){
    console.log(data);
    if(data.id == playerID){
        myTurn = true;
        console.log(myTurn);
    }else{
        myTurn= false;
        console.log(myTurn);
    }
    view.updateTables(shootsCounter,myTurn, myBoard, opponentBoard);
});

socket.on("updateOwnBoard", function(data){
    if(data.id1 == playerID){
        myBoard = data.board1;
        console.log(myBoard);
    }else if(data.id2 == playerID){
        myBoard = data.board2;
        console.log(myBoard);
    }
    view.updateTables(shootsCounter,myTurn, myBoard, opponentBoard);
});

socket.on("opponentName", function(data){
    if(data.name1 == playerName){
        opponentName = data.name2;
    }else if(data.name2 == playerName){
        opponentName = data.name1;
    }
    if(opponentName !== "undefined"){
        document.getElementById("headSp2").innerHTML = opponentName;
    }
});


socket.on("winner", function(data){
    if(data.id == playerID){
        view.showWinnerModal();
        console.log("Gewonnen");
    }else{
        view.showLoserModal();
        console.log("Verloren");
    }
});

socket.on("opponentDisconnected", function(){
  view.showOpponentLeaveModal();
});


function initalizeGameAndPlayer(){
    socket.on("initalizeGameAndPlayer", function (data){
        console.log(data.id1);
        if(data.id1 == playerID){
            opponentBoard = data.board2;
            myTurn = true;
            console.log(myTurn);
        }else if(data.id2 == playerID){
            opponentBoard = data.board1;
            myTurn = false;
            console.log(myTurn);
        }
        view.updateTables(shootsCounter,myTurn, myBoard, opponentBoard);
    });
}

function setPlayerID(){
    socket.emit("setPlayerID", {id: playerID, name: playerName,board: myBoard});
}

function shoot(posX, posY){
    shootsCounter++;
    console.log(shootsCounter);
    console.log(posX + ", " + "" +posY);
    if(opponentBoard[posX][posY] == SHIP){
        opponentBoard[posX][posY] = HIT;
        myTurn = true;
    }else{
        opponentBoard[posX][posY] = MISSED_SHOOT;
        myTurn = false;
        turnChange();
    }
    console.log(opponentBoard);
    socket.emit("setBoard", {id: playerID, board: opponentBoard});
    view.updateTables(shootsCounter,myTurn, myBoard, opponentBoard);
}

function createField (){
    return [
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
        [WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER, WATER],
    ];
}

function setShipsRandomly(field){
    for(let i = 0; i < ships.length; i++){
        for(let j = 0; j < ships[i].amount; j++){
            while(!setShip(field, ships[i])){
            }
        }
    }

}

function setShip(field, ship){
    let x = getRandomInt(0,9);
    let y = getRandomInt(0,9);
    let orientation =  getRandomInt(0,1);
    if(orientation == VERTICAL){

        for(let i = 0; i < ship.length; i++){
            if(!isValidPos(field, x, y+i, orientation, i)){
                return false;
            }
        }
        for(let i = 0; i < ship.length; i++){
            field[x][y+i] = SHIP;
        }
        return true;
    }
    else{
        for(let i = 0; i < ship.length; i++){
            if(!isValidPos(field, x+i, y, orientation, i)){
                return false;
            }
        }
        for(let i = 0; i < ship.length; i++){
            field[x+i][y] = SHIP;
        }
        return true;
    }
}

// checks all fields near the current field
function isValidPos(field,posX, posY, orientation, counter) {
    if(typeof field[posX] === "undefined" || typeof field[posX][posY] === "undefined"){
        return false;
    }
    if(!checkNextFields(field, posX, posY, orientation, counter)) {
        return false;
    }
    return true;
}

function checkNextFields(field, x, y, orientation, counter) {
    if(orientation == VERTICAL){
        if(counter == 0){
            return  checkField(field, x - 1, y - 1)&& // top left
              checkField(field, x, y - 1)&& // top
              checkField(field, x + 1, y - 1) && // top right
              checkField(field, x - 1, y) && // left
              checkField(field, x + 1 , y)&& // right
              checkField(field, x, y + 1); // bottom
        }else{
            return  checkField(field, x - 1, y) && // left
              checkField(field, x + 1, y) && // right
              checkField(field, x - 1, y + 1) && // bottom left
              checkField(field, x, y + 1) && // bottom
              checkField(field, x + 1, y + 1); // bottom right
        }
    } else{
        if(counter == 0){
            return  checkField(field, x - 1, y + 1)&& // bottom left
              checkField(field, x - 1, y)&& // left
              checkField(field, x - 1, y - 1)&& // top left
              checkField(field, x, y + 1)&& // bottom
              checkField(field, x, y - 1) && // top
              checkField(field, x + 1, y); // right
        } else{
            return  checkField(field, x, y - 1)&& // top
              checkField(field, x, y + 1)&& // bottom
              checkField(field, x + 1, y + 1)&& // bottom right
              checkField(field, x + 1, y)&& // right
              checkField(field, x + 1, y - 1); // top right
        }
    }
}

function checkField(field, posX, posY) {
    if(typeof field[posX] === "undefined" || typeof field[posX][posY] === "undefined" || field[posX][posY] == WATER) {
        return true;
    }
    return false;
}

function turnChange(){
    socket.emit("turnChange", {id: playerID});
}

function setBoard(){
    socket.emit("setBoard",{board: myBoard});
}

function saveName(){
    playerName = document.getElementById("player").value;
    socket.emit("saveName", {id: playerID, name: playerName});
    document.getElementById("headSp1").innerHTML = playerName;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
