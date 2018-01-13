
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
app.use(express.static(path.join(__dirname, "/static")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// Router verwenden
app.use("/api/highscore", highscore);
app.use("/api", game);



// localhost:3000 erscheint Seite
app.get("/", function(req, res){
    res.sendFile(__dirname + "/static/schiffeVersenken.html");
});

io.on("connection", function(socket){
    // a user has visited our page
    console.log("a user connected");
    socket.on("disconnect", function() {
        console.log("a user disconnected");
    });
});
