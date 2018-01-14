
const express = require("express");
const app     = express();
const bodyParser = require("body-parser");
const port = 3000;
const path = require("path");
const server  = app.listen(port, function(){
    console.log("Server started on port" + port);
});
const io      = require("socket.io").listen(server);


var highscore = require("./routes/highscore");
var game = require("./routes/game")(io);




// statische Elemente ausliefern
app.use(express.static(path.join(__dirname, "/client")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// Router verwenden
app.use("/api/highscore", highscore);
app.use("/api", game);



// localhost:3000 erscheint Seite
app.get("/", function(req, res){
    res.sendFile(__dirname + "/client/schiffeVersenken.html");
});

app.get("/*", (req, res) => {
	res.status(404).sendFile(__dirname + '/client/404.html');
});

var players = [];

io.on("connection", function(socket){
  players.push(socket);
    // a user has visited our page
    console.log("a user connected");
    socket.on("disconnect", function() {
      let socketIndex = players.indexOf(socket);
      if(socketIndex % 2 == 0){
        if(!(typeof players[socketIndex+1] === 'undefined'))
        players[socketIndex+1].emit("opponentDisconnected");
      }
      if(socketIndex % 2 == 1){
        if(!(typeof players[socketIndex-1] === 'undefined'))
        players[socketIndex-1].emit("opponentDisconnected");
      }
        console.log("a user disconnected");
    });
});
