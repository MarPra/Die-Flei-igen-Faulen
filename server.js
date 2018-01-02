var express = require('express');
var app     = express();
const port = 3000;
var server  = app.listen(port, function(){
  console.log("Server started on port" + port)
});
var io      = require('socket.io').listen(server);
var path = require("path");

var highscore = require('./routes/highscore');
var game = require('./routes/game');


// statische Elemente ausliefern
app.use(express.static(path.join(__dirname, '/static')));

// Router verwenden
app.use("/api", highscore);
app.use("/api", game);

// localhost:3000 erscheint Seite
app.get('/', function(req, res){
//res.sendFile(__dirname + '/static/schiffeVersenken.html');
res.sendFile(__dirname + '/static/schiffeVersenken.html');
});

app.io = io.sockets.on('connection', function(socket){
   // a user has visited our page
  console.log('a user connected');
// empfängt von client
  socket.on('shoot', function(data){
    console.log(data);
    // sendet an Client
    socket.emit('shoot' , true);
  socket.on('disconnect', function() {
    // a user has left our page
    console.log('a user disconnected');
     });
  });
});
