//----------------------------GLOBALE VARIABLEN---------------------------------
let shootsCounter = 0;
let ROWS = 10;
let COLUMNS = 10;
let tableHeadArray = ["#", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
let mySpielfeld = createField();
let otherSpielfeld = createField();
console.log(mySpielfeld);
console.log(otherSpielfeld);

let schiffe = [
  {name: "Schlachtschiff" , length: 5, amount: 1},
  {name: "Kreuzer" , length: 4 , amount: 2},
  {name: "Zerstörer" , length: 3 , amount: 3},
  {name: "U-Boot" , length: 2 , amount: 4}
];

const HORIZONTAL = 1;
const VERTICAL = 0;

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

//----------------------------SPIELLOGIK----------------------------------------

	/* 
	Ship placement
	
	Ships are placed from left to right, in detail from x to x + ship.length 
	or from top to bottom, in detail from y to y + ship.length
	
	
	
	Field values / Field states 
	
	
	important for placement phase
	
	0 := Empty field; occupyable by a new ship
	1 := Occupied field; not occupyable by a new ship
	2 := Empty field, which has at least one field with value 1 as a neighbour field; not occupyable by a new ship
	
	important for battle phase
	
	-1 := Empty field that has been shot; Results from 0- or 1-fields being shot 
	3 := Ship that has been shot; Results from 2-fields being shot
	*/

function createField (fieldname){
  return [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
}


function shoot(posX, posY){
  shootsCounter++;
  console.log(posX, posY);
  if(otherSpielfeld[posX][posY] == 1){
      console.log("Treffer");
      otherSpielfeld[posX][posY] = 2;
      update(otherSpielfeld, document.getElementById('spielfeldGegner'));
  }else{
    otherSpielfeld[posX][posY] = -1;
    update(otherSpielfeld, document.getElementById('spielfeldGegner'));
  }
}


function setShip(field, ship){
  var x = getRandomInt(0,9);
  var y = getRandomInt(0,9);
  var orientation =  getRandomInt(0,1);
    if(orientation == HORIZONTAL){
      for(let i = 0; i < ship.length; i++){
      if(y+i < COLUMNS){
        if(isValidPos(field, x, y+i, orientation, i)){
          field[x][y+i] = 1;
          return true;
        }
          return false;
      }else{
        if(isValidPos(field, x, y-i, orientation, i)){
          field[x][y-i] = 1;
          return true;
        }
        return false;
      }
    }
    }
      //Vertical
    else{
      for(let i = 0; i < ship.length; i++){
        if(x+i <ROWS){
          if(isValidPos(field, x+i, y, orientation, i)){
            field[x+i][y] = 1;
            return true;
          }
          return false;
        }else{
          if(isValidPos(field, x-i, y, orientation, i)){
            field[x-i][y] = 1;
            return true;
          }
          return false;
        }
      }
    }
}

function isValidPos(field, ship, x, y, orientation){

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
}
	/*
function isValidPos(field, x, y, orientation, counter){
  var isValid = true;
  if(orientation == HORIZONTAL){
    if(counter == 0){
      // aktuelle Position
      if(field[x][y] == 0){
        // oben links
        if(typeof field[x-1][y-1] == "undefined" || field[x-1][y-1] == 0){
          // oben mitte
          if(typeof field[x][y-1] == "undefined" || field[x][y-1] == 0){
            // oben rechts
            if(typeof field[x+1][y-1] == "undefined" || field[x+1][y-1] == 0){
              // links daneben
              if(typeof field[x-1][y] == "undefined" || field[x-1][y] == 0){
                // rechts daneben
                if(typeof field[x+1][y] == "undefined" || field[x+1][y] == 0){
                  // darunter
                  if(typeof field[x][y+1] == "undefined" || field[x][y+1] == 0){
                    return true;
                  }
                }
              }
            }
          }
        }
        }
        return false;
      } else{
        // aktuelle Position
          if(field[x][y] == 0){
            //links daneben
            if(typeof field[x-1][y] == "undefined" || field[x-1][y] == 0){
              // rechts daneben
              if(typeof field[x+1][y] == "undefined" || field[x+1][y] == 0){
                //links darunter
                if(typeof field[x-1][y+1] == "undefined" || field[x-1][y+1] == 0){
                  // darunter
                  if(typeof field[x][y+1] == "undefined" || field[x][y+1] == 0){
                    //recht darunter
                    if(typeof field[x+1][y+1] == "undefined" || field[x+1][y+1] == 0){
                      return true;
                    }
                  }
                }
              }
            }
          }
          return false;
      }
    }
    // Vertical
  else{
      if(counter == 0){
        //links unten daneben
        if(typeof field[x-1][y+1] == "undefined" || field[x-1][y+1] == 0){
          // links daneben
          if(typeof field[x-1][y] == "undefined" || field[x-1][y] == 0){
            // rechts oben daneben
            if(typeof field[x-1][y-1] == "undefined" || field[x-1][y-1] == 0){
              // unten
              if(typeof field[x][y+1] == "undefined" || field[x][y+1] == 0){
                // oben
                if(typeof field[x][y-1] == "undefined" || field[x][y-1] == 0){
                  return true;
                }
              }
            }
          }
        }
        return false;
      }else{
        // oben
        if(typeof field[x][y-1] == "undefined" || field[x][y-1] == 0){
          // unten
          if(typeof field[x][y+1] == "undefined" || field[x][y+1] == 0){
            // rechts unten daneben
            if(typeof field[x+1][y+1] == "undefined" ||  field[x+1][y+1] == 0){
              // rechts daneben
              if(typeof field[x+1][y] == "undefined" ||  field[x+1][y] == 0){
                // rechts oben daneben
                if(typeof field[x+1][y-1] == "undefined" ||  field[x+1][y-1] == 0){
                  return true;
                }
              }
            }
          }
        }
        return false;
      }
  }
 
}
 */
function startPosShip(counter, firstPos){
  return firstPos - counter;
}


// platziert die Schiffe zufällig
function setRandomShips(field){
  for(let i = 0; i < schiffe.length; i++){
    for(let j = 0; j < schiffe[i].amount; j++){
      while(!setShip(field, schiffe[i])){
        console.log(schiffe[i].name);
      }
    }
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//----------------------------GAMEANZEIGE---------------------------------------
function initalize(){
  var spielfeldEigen = document.getElementById("spielfeldEigen");
  // renderTable(spielfeldEigen, 10, 10);
   var spielfeldGegner = document.getElementById("spielfeldGegner");
   //renderTable(spielfeldGegner, 10, 10);
   showHighscore();
   showPlayerModal();
   setRandomShips(mySpielfeld);
   setRandomShips(otherSpielfeld);
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
