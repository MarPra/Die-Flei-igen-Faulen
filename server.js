var express = require("express");
var app = express();
var path = require("path");
var http = require('http').Server(app);
var io = require('socket.io')(http);
const port = 3000;

// statische Elemente ausliefern
app.use(express.static(path.join(__dirname, '/static')));

// localhost:3000 erscheint Seite
app.get('/', function(req, res){
res.sendFile(__dirname + '/static/schiffeVersenken.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

app.listen(port, function(){
  console.log("Server started on port" + port)
});
