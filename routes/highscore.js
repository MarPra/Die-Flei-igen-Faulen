const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/", (req, res) => {
    // Read Highscores
    fs.readFile("routes/files/highscore.json", function(err, data){
        if(err) {
            console.log(err);
            res.status(500);
            return;
        }

        // Return Highscores
        console.log("kein Error");
        console.log(JSON.parse(data));
        res.status(200).json(JSON.parse(data));
    });
});

router.post("/", (req, res) => {
    // Read Highscores
    fs.readFile("routes/files/highscore.json", function (err, data){
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
        fs.writeFile("routes/files/highscore.json", JSON.stringify(json), (err) => {
            if(err) {
                res.status(500);
                return;
            }
            res.status(201);
        });
    });

});

module.exports = router;
