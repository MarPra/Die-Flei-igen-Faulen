const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/", (req, res) => {
    console.log("GET FUNCTION");
    // Read Highscores
    fs.readFile("files/highscore.json", "utf8", function(err, data){
        console.log("read File");
        if(err) {
            console.log("Error");
            res.status(500);
            return;
        }

        // Return Highscores
        console.log("kein Error");
        res.status(200).json(JSON.parse(data));
    });
});

router.post("/", (req, res) => {
    // Read Highscores
    fs.readFile("files/highscore.json", "utf8", (err, data) => {
        if(err) {
            res.status(500);
            return;
        }
        let json = JSON.parse(data);

        // Add new Highscore
        json.highscore.push(
            {
                name: req.body.name,
                points: req.body.points
            }
        );

        // Write new Highscores
        fs.writeFile("files/highscore.json", JSON.stringify(json), "utf8", (err) => {
            if(err) {
                res.status(500);
                return;
            }
            res.status(201);
        });
    });

});

module.exports = router;
