//----------------------------GLOBALE VARIABLEN---------------------------------
let shotsCounter = 0;
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
  console.log(posX, posY);
  if(otherSpielfeld[posX][posY] == 1){
      console.log("Treffer");
      showShoot(posX, posY);
  }
}


function setShip(field, schiff){
  var x = getRandomInt(0,9);
  var y = getRandomInt(0,9);
  var orientierung =  getRandomInt(0,1);
    if(orientierung == HORIZONTAL){
      var counterY = 0;
      for(let i = 0; i < schiff.länge; i++){
      if(y+i < 10){
          field[x][y+i] = 1;
      }else{
        field[x][y-i] = 1;
        counterY = i;
      }
    }
    var startPosY = startPosShip(counterY);
    return isValidPos(field, x, startPosY);
    }
      //Vertical
    else{
      var counterX = 0;
      for(let i = 0; i < schiff.länge; i++){
        if(x+i <10){
          field[x+i][y] = 1;
        }else{
          field[x-i][y] = 1;
          counterX = i;
        }
      }
      var startPosX = startPosShip(counterX);
      return isValidPos(field, startPosX, y);
    }
}

// TODO: Algorithmus für das checken der Schiffe verfeinern funktioniert nicht immer
function isValidPos(field, schiff, x, y, orientierung){
  var isValid = true;
  if(orientierung == HORIZONTAL){
    for(let i = 0; i < schiff.länge; i++){
      if(i == 0){
        // oberhalb checken
        if(field[x][y-1] == 0 && field[x-1][y-1] == 0 && field[x+1][y-1] == 0 &&
        field[x-1][y+i] == 0 && field[x+1][y+i] == 0){
          isValid = true;
        }
        return false;
        // unterhalbe checken
      }else if (i == schiff.länge -1){
        if(field[x][y+i+1] == 0 && field[x-1][y+i] == 0 && field[x+1][y+i] == 0 &&
        field[x-1][y+i] == 0 && field[x+1][y-i] == 0){
            isValid = true;
        }
        return false;
        // seitlich checken
      } else{
        if(field[x-1][y+i] == 0 && field[x+1][y+i] == 0){
            isValid = true;
        }
        return false;
      }
    }
  }
// Vertical
  else{
      for(let i = 0; i < schiff.länge; i++){
  // links checken
        if(i == 0){
          if(field[x-1][y] == 0 && field[x-1][y-1] == 0 && field[x-1][y+1] == 0 &&
          field[x+i][y-1] == 0 && field[x+1][y+1] == 0){
            isValid = true;
          }
          return false;
          // rechts checken
        }else if (i == schiff.länge -1){
          if(field[x+i+1][y] == 0 && field[x+i+1][y-1] == 0 && field[x+i+1][y+1] == 0 &&
          field[x+i][y-1] == 0 && field[x+1][y+1] == 0){
            isValid = true;
        }
        return false;
      } else{
        if(field[x+i][y-1] == 0 && field[x+1][y+1] == 0){
          isValid = true;
        }
        return false;
      }
      }
  }
  return isValid;
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
  //var table = document.getElementById("spielfeldEigen");
  //update(field, table);

}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//----------------------------GAMEANZEIGE---------------------------------------
function initalize(){
  var spielfeldEigen = document.getElementById("spielfeldEigen");
   renderTable(spielfeldEigen, 10, 10);
   var spielfeldGegner = document.getElementById("spielfeldGegner");
   renderTable(spielfeldGegner, 10, 10);
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
    for (var row = 0; row < 10; row++) {
      var rowElement = document.createElement("tr");
      var rowHead = document.createElement('th');
      rowHead.setAttribute("scope", "row");
      rowHead.innerHTML = row;
      rowElement.appendChild(rowHead);
      table.appendChild(rowElement);
        for (var column = 0; column < 10; column++) {
            var columnElement = document.createElement('td');
            if(field[row][column] == 1){
              columnElement.setAttribute("class", "Schiff");
              columnElement.setAttribute("style", "border: 3px solid blue;")
            }
              rowElement.appendChild(columnElement);
        }
      }
  } else{
    for (var row = 0; row < 10; row++) {
      var rowElement = document.createElement("tr");
      var rowHead = document.createElement('th');
      rowHead.setAttribute("scope", "row");
      rowHead.innerHTML = row;
      rowElement.appendChild(rowHead);
      table.appendChild(rowElement);
        for (var column = 0; column < 10; column++) {
            var columnElement = document.createElement('td');
            columnElement.setAttribute("onclick" , "shoot(" + row +"," + column + ")");
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

function showShoot(posX, posY){
  var table = document.getElementById("spielfeldGegner");
  table.innerHTML = "";
  renderTableHead(table);
  for (var row = 0; row < 10; row++) {
    var rowElement = document.createElement("tr");
    var rowHead = document.createElement('th');
    rowHead.setAttribute("scope", "row");
    rowHead.innerHTML = row;
    rowElement.appendChild(rowHead);
    table.appendChild(rowElement);
      for (var column = 0; column < 10; column++) {
          var columnElement = document.createElement('td');
          if(column === posY && row === posX){
            columnElement.setAttribute("style" , "border: 3px solid green;");
          }
          columnElement.setAttribute("onclick" , "shoot(" + row +"," + column + ")");
          rowElement.appendChild(columnElement);
}
}
}
