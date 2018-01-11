//----------------------------GLOBAL VARIABLES---------------------------------

const HORIZONTAL = 1;
const VERTICAL = 0;
const ROWS = 10;
const COLUMNS = 10;
const WATER = 0;
const SHIP = 1;
const MISSED_SHOOT = -1;
const HIT = 2;
const socket =  io();
const playerID = getRandomInt(1000, 999999);
let shootsCounter = 0;
const tableHeadArray = ["#", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
let myBoard = createField();
let opponentBoard = createField();
let myTurn;
let myTable = document.getElementById("spielfeldEigen");
let opponentTable = document.getElementById("spielfeldGegner");
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

console.log(playerID);


function initalize(){
    inGame = true;
    getHighscore();
  //  setHighscore();
    setShipsRandomly(myBoard);
    setPlayerID();
    initalizeGameAndPlayer();
    showPlayerModal();
    updateMyTable();
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
    updateOpponentTable();
});

socket.on("updateOwnBoard", function(data){
    if(data.id1 == playerID){
        myBoard = data.board1;
        console.log(myBoard);
    }else if(data.id2 == playerID){
        myBoard = data.board2;
        console.log(myBoard);
    }
    updateMyTable();
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
        showWinnerModal();
        console.log("Gewonnen");
    }else{
        showLoserModal();
        console.log("Verloren");
    }

});


function initalizeGameAndPlayer(){
    socket.on("initalizeGameAndPlayer", function (data){
        console.log(data.id1);
        if(data.id1 == playerID){
            opponentBoard = data.board2;
            console.log("Player1");
            console.log(myBoard);
            console.log(opponentBoard);
            myTurn = true;
            console.log(myTurn);
        }else if(data.id2 == playerID){
            console.log(data.id2);
            opponentBoard = data.board1;
            console.log("Player2");
            myTurn = false;
            console.log(myBoard);
            console.log(opponentBoard);
            console.log(myTurn);
        }
        updateOpponentTable();
        updateMyTable();
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
    updateOpponentTable();
}


function updateMyTable(){
    renderCurrentPlayer();
    document.getElementById("currentShoots").innerHTML = shootsCounter;
    myTable.innerHTML = "";
    renderTableHead(myTable);
    for (let row = 0; row < ROWS; row++) {
        let rowElement = document.createElement("tr");
        let rowHead = document.createElement("th");
        rowHead.setAttribute("scope", "row");
        rowHead.innerHTML = row;
        rowElement.appendChild(rowHead);
        myTable.appendChild(rowElement);
        for (let column = 0; column < COLUMNS; column++) {
          let field = document.createElement("td");
            if(myBoard[column][row] == SHIP){
                field.setAttribute("style", "border: 3px solid blue");
            }
            if(myBoard[column][row] == HIT){
                field.setAttribute("style", "border: 3px solid red");
            }
            if(myBoard[column][row] == MISSED_SHOOT){
                field.innerHTML = "x";
            }
            rowElement.appendChild(field);
        }
    }
}

function turnChange(){
    socket.emit("turnChange", {id: playerID});
}

function renderCurrentPlayer(){
  if(myTurn){
      document.getElementById("headSp1").setAttribute("style", "color: red");
      document.getElementById("headSp2").setAttribute("style", "color: black");
  }else{
      document.getElementById("headSp1").setAttribute("style", "color: black");
      document.getElementById("headSp2").setAttribute("style", "color: red");
  }
}

function updateOpponentTable(){
    opponentTable.innerHTML = "";
    renderTableHead(opponentTable);
    for (let row = 0; row < ROWS; row++) {
        let rowElement = document.createElement("tr");
        let rowHead = document.createElement("th");
        rowHead.setAttribute("scope", "row");
        rowHead.innerHTML = row;
        rowElement.appendChild(rowHead);
        opponentTable.appendChild(rowElement);
        for (let column = 0; column < COLUMNS; column++){
            let field = document.createElement("td");
            if(opponentBoard[column][row] == HIT){
                field.setAttribute("style" , "border: 3px solid green;");
            }
            if(opponentBoard[column][row] == MISSED_SHOOT){
                field.innerHTML = "-";
            }
            if(myTurn){
                if(opponentBoard[column][row] == WATER || opponentBoard[column][row] == SHIP){
                    field.setAttribute("onclick" , "shoot("+  column+"," +  row+ ")");
                }
            }
            rowElement.appendChild(field);
        }
    }
}

function renderTableHead(table){
    let tableHead = document.createElement("thead");
    let rowElement = document.createElement("tr");
    table.appendChild(tableHead);
    tableHead.appendChild(rowElement);
    for(let i = 0; i < tableHeadArray.length ; i++){
        let th = document.createElement("th");
        th.innerHTML = tableHeadArray[i];
        th.setAttribute("scope","col");
        rowElement.appendChild(th);
    }
}

function setBoard(){
    socket.emit("setBoard",{board: myBoard});
}

function saveName(){
    playerName = document.getElementById("player").value;
    socket.emit("saveName", {id: playerID, name: playerName});
    document.getElementById("headSp1").innerHTML = playerName;
}

function showHighscore(highscoreArray){
    let highscore = document.getElementById("Highscore");
    if(highscoreArray.length == 0) {
        highscore.innerHTML = "Noch kein Highscore verfügbar";
    }

    for(let i = 0; i < highscoreArray.length; i++){
      let score = document.createElement("p");
      score.innerHTML = i+1 + "." + highscoreArray[i].name + "  " + highscoreArray[i].points;
      let br = document.createElement("br");
      score.appendChild(br);
      highscore.appendChild(score);
    }

}

// TODO: Load Highscore from REST-API
function getHighscore(){
    console.log("updateHighscore");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiURL + "highscore", true);
    xhr.responseType = "json";
    xhr.onload = function(){
      if (this.readyState == 4 && this.status == 200) {
          console.log("Gut gegangen");
          console.log(xhr.response);
          showHighscore(getBestScores(xhr.response,5));
      } else{
        console.log("Schief gegangen");
      }
    };
    xhr.send();
}

function getBestScores(highscores, nr) {
  console.log(highscores);
  highscores.sort(function(a,b){
    return a.points-b.points;
  });

  let bestResults = [];

  for(let i = 0; i < nr && i < highscores.length; i++){
    bestResults.push(highscores[i]);
  }
  return bestResults;
}

function setHighscore(){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", apiURL + "highscore", true);
  xhr.onload = function(){
    if (this.readyState == 4 && this.status == 200) {
        console.log("Gut gegangen");
    } else{
      console.log("Schief gegangen");
    }
  };
  xhr.send({"name": "Test", "points":90});
}


function showPlayerModal(){
    $("#spielerEingabe").modal("show");
}

function showWinnerModal(){
    $("#WinnerModal").modal("show");
}

function showLoserModal(){
    $("#LooserModal").modal("show");
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
                console.log(ships[i].name);
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
