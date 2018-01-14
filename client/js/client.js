//----------------------------GLOBAL VARIABLES---------------------------------
let myBoard = createField();
let opponentBoard = createField();
const socket =  io();
const playerID = getRandomInt(1000, 999999);
let shootsCounter = 0;
let myTurn;
const view = new View();
const highscore = new Highscore();
let inGame;
let playerName;
let opponentName;

let ships = [
    {name: "battleship" , length: 5, amount: 1},
    {name: "cruiser" , length: 4 , amount: 2},
    {name: "destroyer" , length: 3 , amount: 3},
    {name: "submarine" , length: 2 , amount: 4}
];

function initalize(){
    inGame = true;
    highscore.getHighscore();
    setPlayerInformation();
    setShipsRandomly(myBoard);
    view.showPlayerModal();
    view.updateTables(shootsCounter,myTurn, myBoard, opponentBoard);
}

//-----------------------SERVER LISTENER ----------------------------

// Listener for Server Events to realize Realtime
socket.on("beginner", function(data){
  myTurn = data;
  console.log(myTurn);
  view.updateTables(shootsCounter, myTurn, myBoard, opponentBoard);
});

socket.on("opponentName", function(data){
    opponentName = data.name;
    if(typeof opponentName === "undefined"){
      document.getElementById("headSp2").innerHTML = "Waiting for Player";
    }else{
        document.getElementById("headSp2").innerHTML = opponentName;
    }

});

socket.on("looser", function () {
  view.showLoserModal();
});

function setPlayerInformation(){
  socket.emit("setPlayerInformation", {id: playerID, name: playerName,board: myBoard});
}

function shoot(posX, posY){
  let hit;
  shootsCounter++;
  console.log(posX + ", " + posY);
  socket.emit("shoot", {x: posX, y: posY});
  view.updateTables(shootsCounter,myTurn, myBoard, opponentBoard);
}

socket.on("shootResult", function(data){
  console.log("shootResult");
  hit = data.val;
  posX = data.x;
  posY = data.y;
  console.log(hit);
  if(hit){
    opponentBoard[posX][posY] = HIT;
    myTurn = true;
    if(winner()){
      view.showWinnerModal();
      highscore.setHighscore(playerName, shootsCounter);
      socket.emit("winner");
    }
  }else{
    opponentBoard[posX][posY] = MISSED_SHOOT;
    myTurn = false;
  }
  view.updateTables(shootsCounter,myTurn, myBoard, opponentBoard);
});

socket.on("opponentShoot", function(data){
  let posX = data.x;
  let posY = data.y;
  console.log("opponentShoot");
  if(data.val){
    myBoard[posX][posY] = HIT;
    myTurn = false;
  }else{
    myBoard[posX][posY] = MISSED_SHOOT;
    myTurn = true;
  }
  view.updateTables(shootsCounter,myTurn, myBoard, opponentBoard);
});

socket.on("opponentDisconnected", function(){
  view.showOpponentLeaveModal();
});

function winner(){
  let hitCounter = 0;
  for(let i = 0; i < ROWS; i++){
    for (let j = 0; j < COLUMNS; j++){
      if(opponentBoard[i][j] == HIT){
        hitCounter++;
      }
    }
  }
  return hitCounter == 30;
}

//-------------------------SHIP FUNCTIONS-------------------------------

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

function saveName(){
    playerName = document.getElementById("player").value;
    socket.emit("saveName", {name: playerName});
    document.getElementById("headSp1").innerHTML = playerName;
}

//---------------HELPER FUNCTION----------------------

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
