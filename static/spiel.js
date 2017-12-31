//----------------------------GLOBAL VARIABLES---------------------------------
const HORIZONTAL = 1;
const VERTICAL = 0;
const ROWS = 10;
const COLUMNS = 10;
const WATER = 0;
const SHIP = 1;
const MISSED_SHOOT = -1;
const HIT = 2;
let shootsCounter = 0;
let tableHeadArray = ["#", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
let mySpielfeld = createField();
let otherSpielfeld = createField();
console.log(mySpielfeld);
console.log(otherSpielfeld);

let ships = [
  {name: "battleship" , length: 5, amount: 1},
  {name: "cruiser" , length: 4 , amount: 2},
  {name: "destroyer" , length: 3 , amount: 3},
  {name: "submarine" , length: 2 , amount: 4}
];

//----------------------------MODALS--------------------------------------------
function showPlayerModal(){
   $("#spielerEingabe").modal('show');
}

function showWinnerModal(winner){
  $("#WinnerModal").modal('show');
}

function showDisconnectedModal(){
   $("#DisconnectedModal").modal('show');
}

//----------------------------GAME LOGIC----------------------------------------

	/*
	Ship placement

	Ships are placed from left to right, in detail from x to x + ship.length
	or from top to bottom, in detail from y to y + ship.length



	Field values / Field states


	introduced with placement phase

	0 := Empty field; occupyable by a new ship
	1 := Occupied field; not occupyable by a new ship

	introduced with battle phase

	-1 := Empty field that has been shot; Results from 0- or 1-fields being shot
	2 := Ship that has been shot; Results from 1-fields being shot
	*/

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


function shoot(posX, posY){
  shootsCounter++;
  console.log(posX, posY);
  if(otherSpielfeld[posX][posY] == SHIP){
      console.log("Treffer");
      otherSpielfeld[posX][posY] = HIT;
      update(otherSpielfeld, document.getElementById('spielfeldGegner'));
  }else{
    otherSpielfeld[posX][posY] = MISSED_SHOOT;
    update(otherSpielfeld, document.getElementById('spielfeldGegner'));
  }
}


function setShip(field, ship){
  var x = getRandomInt(0,9);
  var y = getRandomInt(0,9);
  var orientation =  getRandomInt(0,1);
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

function checkNextFields(field, x, y, orientation, counter) {
  if(orientation == VERTICAL){
    if(counter == 0){
      return checkField(field, x - 1, y - 1)&& // top left
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

// checks current field // check for what?
function checkField(field, posX, posY) {
  if(typeof field[posX] === 'undefined' || typeof field[posX][posY] === 'undefined' || field[posX][posY] == WATER) {
    return true;
  }
  return false;
}

// checks all fields near the current field
function isValidPos(field,posX, posY, orientation, counter) {
  if(typeof field[posX] === 'undefined' || typeof field[posX][posY] === 'undefined'){
    return false;
  }
  if(!checkNextFields(field, posX, posY, orientation, counter)) {
      return false;
  }
  return true;
}

/*function isValidPos(field, ship, x, y, orientation){

	if(orientation == HORIZONTAL && x + ship.length <= 9){
	// Is the horizontal border not overstepped?
		for(let i = x; i < x + ship.length; i++) {
		// Check for every field where the ship would be placed whether that placement is valid
			if(field[i][y] != 0) {
				return false;
			}
		}
		return true;
	} else if (orientation == VERTICAL && y + ship.length <= 9){
	// Is the vertical border not overstepped?
		for(let i = y; i < y + ship.length; i++) {
		// Check for every field where the ship would be placed whether that placement is valid
			if(field[x][i] != 0) {
				return false;
			}
		}
		return true;
	}
	return false;
}*/


// set all ships randomly
function setShipsRandomly(field){
  for(let i = 0; i < ships.length; i++){
      for(let j = 0; j < ships[i].amount; j++){
        while(!setShip(field, ships[i])){
          console.log(ships[i].name);
        }
      }
    }
  }

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//----------------------------GAME DISPLAY---------------------------------------
function initalize(){
  var spielfeldEigen = document.getElementById("spielfeldEigen");
  // renderTable(spielfeldEigen, 10, 10);
   var spielfeldGegner = document.getElementById("spielfeldGegner");
   //renderTable(spielfeldGegner, 10, 10);
   showHighscore();
   showPlayerModal();
   console.log("Mein Spielfeld");
   setShipsRandomly(mySpielfeld);
   console.log("Andere Spielfeld");
   setShipsRandomly(otherSpielfeld);
   update(mySpielfeld, spielfeldEigen);
   update(otherSpielfeld, spielfeldGegner);
}

function update (field, table){
  // delete older table
  table.innerHTML = "";
  renderTableHead(table);
  if(field == mySpielfeld){
    for (var row = 0; row < ROWS; row++) {
      var rowElement = document.createElement("tr");
      var rowHead = document.createElement('th');
      rowHead.setAttribute("scope", "row");
      rowHead.innerHTML = row;
      rowElement.appendChild(rowHead);
      table.appendChild(rowElement);
        for (var column = 0; column < COLUMNS; column++) {
            var columnElement = document.createElement('td');
            if(field[row][column] == 1){
              columnElement.setAttribute("class", "Schiff");
              columnElement.setAttribute("style", "border: 3px solid blue;")
            }
            if(field[row][column] == 2){
              columnElement.setAttribute("style", "border: 3px solid red;")
            }
              rowElement.appendChild(columnElement);
        }
      }
  } else{
    for (var row = 0; row < ROWS; row++) {
      var rowElement = document.createElement("tr");
      var rowHead = document.createElement('th');
      rowHead.setAttribute("scope", "row");
      rowHead.innerHTML = row;
      rowElement.appendChild(rowHead);
      table.appendChild(rowElement);
        for (var column = 0; column < COLUMNS; column++) {
            var columnElement = document.createElement('td');
            if(field[row][column] == 2){
              columnElement.setAttribute("style" , "border: 3px solid green;");
            } else if(field[row][column] == -1){
              columnElement.innerHTML = "-";
            }
            else{
              columnElement.setAttribute("onclick" , "shoot("+ row +"," + column + ")");
            }
            rowElement.appendChild(columnElement);
  }
}
}
}

function renderTable(table, rows, columns) {
  renderTableHead(table);
    for (var row = 0; row < rows; row++) {
      var rowElement = document.createElement("tr");
      var rowHead = document.createElement('th');
      rowHead.setAttribute("scope", "row");
      rowHead.innerHTML = row;
      rowElement.appendChild(rowHead);
      table.appendChild(rowElement);
        for (var column = 0; column < columns; column++) {
            var columnElement = document.createElement('td');
            columnElement.setAttribute("onclick" , "shoot(" + row +"," + column + ")");
            rowElement.appendChild(columnElement);
          }
        }
}

function renderTableHead(table){
  var tableHead = document.createElement("thead");
  var rowElement = document.createElement("tr");
  table.appendChild(tableHead);
  tableHead.appendChild(rowElement);
  for(var i = 0; i < tableHeadArray.length ; i++){
    var th = document.createElement("th");
    th.innerHTML = tableHeadArray[i];
    th.setAttribute("scope","col");
    rowElement.appendChild(th);
  }
}


function saveNames(){
  var sp1 = document.getElementById("spieler1").value;
  var sp2 = document.getElementById("spieler2").value;
  document.getElementById("headSp1").innerHTML = sp1;
  document.getElementById("headSp2").innerHTML = sp2;
}

// TODO: Load Highscore from REST-API
function showHighscore(){
  var highscore = document.getElementById("Highscore");
  highscore.innerHTML = "Hier wird der Highscore geladen";
}
