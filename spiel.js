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
  {name: "Schlachtschiff" , länge: 5, anzahl: 1},
  {name: "Kreuzer" , länge: 4 , anzahl: 2},
  {name: "Zerstörer" , länge: 3 , anzahl: 3},
  {name: "U-Boot" , länge: 2 , anzahl: 4}
];

const HORIZONTAL = 1;
const VERTIKAL = 0;

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


function setShip(field, schiff){
  var x = getRandomInt(0,9);
  var y = getRandomInt(0,9);
  var orientierung =  getRandomInt(0,1);
    if(orientierung == HORIZONTAL){
      for(let i = 0; i < schiff.länge; i++){
      if(y+i < COLUMNS){
        if(isValidPos(field, x, y+i, orientierung, i)){
          field[x][y+i] = 1;
          return true;
        }
          return false;
      }else{
        if(isValidPos(field, x, y-i, orientierung, i)){
          field[x][y-i] = 1;
          return true;
        }
        return false;
      }
    }
    }
      //Vertical
    else{
      for(let i = 0; i < schiff.länge; i++){
        if(x+i <ROWS){
          if(isValidPos(field, x+i, y, orientierung, i)){
            field[x+i][y] = 1;
            return true;
          }
          return false;
        }else{
          if(isValidPos(field, x-i, y, orientierung, i)){
            field[x-i][y] = 1;
            return true;
          }
          return false;
        }
      }
    }
}

function isValidPos(field, x, y, orientierung, counter){
// TODO: Rename orientierung to orientation
// TODO: Rename VERTIKAL to VERTICAL
// TODO: Rename schiff to ship
// TODO: Rename schiff.länge to schiff.length / ship.length
function isValidPos(field, schiff, x, y, orientierung){
	
	if(orientierung == HORIZONTAL && x + schiff.length <= 9){
	// Is the horizontal border not overstepped?
		for(let i = x; i < x + schiff.length; i++) {
		// Check for every field where the ship would be placed whether that placement is valid
			if(field[i][y] != 1) {
				return false;
			}
		}
		return true;
	} else if (orientierung == VERTIKAL && y + schiff.length <= 9){
	// Is the vertical border not overstepped?
		for(let i = y; i < y + schiff.length; i++) {
		// Check for every field where the ship would be placed whether that placement is valid
			if(field[x][i] != 1) {
				return false;
			}
		}
		return true;
	}
	return false;
}
	/*
  var isValid = true;
  if(orientierung == HORIZONTAL){
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
  */
}

function startPosShip(counter, firstPos){
  return firstPos - counter;
}


// platziert die Schiffe zufällig
function setRandomShips(field){
  for(let i = 0; i < schiffe.length; i++){
    for(let j = 0; j < schiffe[i].anzahl; j++){
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
