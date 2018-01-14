class View {


   showPlayerModal(){
      $("#spielerEingabe").modal("show");
  }

   showWinnerModal(){
      $("#WinnerModal").modal("show");
  }

   showLoserModal(){
      $("#LooserModal").modal("show");
  }

   showOpponentLeaveModal(){
    $("#OpponentLeaveModal").modal("show");
  }

   renderCurrentPlayer(myTurn){
    if(myTurn){
        document.getElementById("headSp1").setAttribute("style", "color: red");
        document.getElementById("headSp2").setAttribute("style", "color: black");
    }else{
        document.getElementById("headSp1").setAttribute("style", "color: black");
        document.getElementById("headSp2").setAttribute("style", "color: red");
    }
  }

   updateMyTable(board){
      //renderCurrentPlayer();
      myTable.innerHTML = "";
      this.renderTableHead(myTable);
      for (let row = 0; row < ROWS; row++) {
          let rowElement = document.createElement("tr");
          let rowHead = document.createElement("th");
          rowHead.setAttribute("scope", "row");
          rowHead.innerHTML = row;
          rowElement.appendChild(rowHead);
          myTable.appendChild(rowElement);
          for (let column = 0; column < COLUMNS; column++) {
            let field = document.createElement("td");
              if(board[column][row] == SHIP){
                  field.setAttribute("style", "border: 3px solid blue");
              }
              if(board[column][row] == HIT){
                  field.setAttribute("style", "border: 3px solid red");
              }
              if(board[column][row] == MISSED_SHOOT){
                  field.innerHTML = "x";
              }
              rowElement.appendChild(field);
          }
      }
  }

   updateOpponentTable(board){
      opponentTable.innerHTML = "";
      this.renderTableHead(opponentTable);
      for (let row = 0; row < ROWS; row++) {
          let rowElement = document.createElement("tr");
          let rowHead = document.createElement("th");
          rowHead.setAttribute("scope", "row");
          rowHead.innerHTML = row;
          rowElement.appendChild(rowHead);
          opponentTable.appendChild(rowElement);
          for (let column = 0; column < COLUMNS; column++){
              let field = document.createElement("td");
              if(board[column][row] == HIT){
                  field.setAttribute("style" , "border: 3px solid green;");
              }
              if(board[column][row] == MISSED_SHOOT){
                  field.innerHTML = "-";
              }
              if(myTurn){
                  if(board[column][row] == WATER || board[column][row] == SHIP){
                      field.setAttribute("onclick" , "shoot("+  column+"," +  row+ ")");
                  }
              }
              rowElement.appendChild(field);
          }
      }
  }

   renderTableHead(table){
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


     updateTables(shoots, myTurn, myBoard, opponentBoard){
      this.renderShoot(shoots);
      this.renderCurrentPlayer(myTurn);
      this.updateMyTable(myBoard);
      this.updateOpponentTable(opponentBoard);
    }

    renderShoot(shoots){
     document.getElementById("currentShoots").innerHTML = shoots;
   }

}
