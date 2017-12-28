//----------------------------GLOBALE VARIABLEN---------------------------------
let shotsCounter = 0;
let tableHeadArray = ["#", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "#"];
let mySpielfeld = [
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

function shoot(posX, posY){

}


function setShip(schiff, x, y, orientierung){
  for(let i = 0; i < schiff.länge; i++){
    if(orientierung == HORIZONTAL){
      if(y+i < 10){
          mySpielfeld[x][y+i] = 1;
      }else{
        mySpielfeld[x][y-i] = 1;
      }
    }else{
      if(x+i < 10){
        mySpielfeld[x+i][y] = 1;
      }else{
        mySpielfeld[x-i][y] = 1;
      }
    }
  }
}

/*function felderNebenSchiffFrei(schiff, x, y, orientierung){
  if(orientierung == HORIZONTAL){
    for(let i = 0; i< schiff.länge; i++){
      // Prüfung oberhalb
      if(mySpielfeld[x][y-1] == 1 && i == 0 && y !< 0){
        return false;
      }
      // Prüfung oberhalb rechts
      if(mySpielfeld[x+1][y-1] == 1 && x+1 !> 10 && y !< 0){
        return false;
      }
      // Prüfung oben links
      if(mySpielfeld[x-1][y-1] == 1 && x-1 ! && y !< 0){
        return false;
      }
  }

  for(let i = 0; i< schiff.länge; i++){
    if(mySpielfeld[x][y])

  }
  return true;
}*/

// TODO: Load Highscore from REST-API
function showHighscore(){
  var highscore = document.getElementById("Highscore");
  highscore.innerHTML = "Hier wird der Highscore geladen";
}

// platziert die Schiffe zufällig
function placeRandomShips(){
  for(let i = 0; i < schiffe.length; i++){
    for(let j = 0; j < schiffe[i].anzahl; j++){
      var posX = Math.round(Math.random() * (10 - 1)) + 1;
      var posY = Math.round(Math.random() * (10 - 1)) + 1;
      var orientierung =  Math.round(Math.random() * (1 - 0)) + 0;
        setShip(schiffe[i], posX, posY, orientierung);
    }
  }
  var table = document.getElementById("spielfeldEigen");
  update(table);

}

//----------------------------GAMEANZEIGE---------------------------------------
function initalize(){
  var spielfeldEigen = document.getElementById("spielfeldEigen");
   renderTable(spielfeldEigen, 10, 10);
   var spielfeldGegner = document.getElementById("spielfeldGegner");
   renderTable(spielfeldGegner, 10, 10);
   showHighscore();
   showPlayerModal();
   placeRandomShips();
}

function update (table){
  // delete older table
  table.innerHTML = "";
  for (var row = 0; row < 10; row++) {
      var rowElement = document.createElement('tr');
      table.appendChild(rowElement);
      for (var column = 0; column < 10; column++) {
          var columnElement = document.createElement('td');
          if(mySpielfeld[row][column] == 1){
            columnElement.setAttribute("class", "Schiff");
            columnElement.setAttribute("style", "border: 3px solid blue;")
          }
            rowElement.appendChild(columnElement);
      }
    }
}

function renderTable(table, rows, columns) {
  renderTableHead(table, columns);
    for (var row = 0; row < rows; row++) {
        var rowElement = document.createElement('tr');
        var rowHead = document.createElement('th');
        rowHead.setAttribute("scope", "row");
        rowHead.innerHTML = row;
        for (var column = 0; column < columns+2; column++) {

          if(column == 0 || column == 11){
            rowElement.appendChild(rowHead);
            table.appendChild(rowElement);
          }else{
            var columnElement = document.createElement('td');
            rowElement.appendChild(columnElement);
          }
        }
    }
    renderTableHead(table, columns);
}

function renderTableHead(table, columns){
  var tableHead = document.createElement("thead");
  var rowElement = document.createElement("tr");
  table.appendChild(tableHead);
  tableHead.appendChild(rowElement);
  for(var i = 0; i < columns + 2 ; i++){
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
