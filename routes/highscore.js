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
  console.log(req);
    // Read Highscores
    fs.readFile("routes/files/highscore.json", function (err, data){
        if(err) {
            res.status(500);
            return;
        }
        let json = JSON.parse(data);

        console.log(json);
        // Add new Highscore
        console.log("REQ BODY");
          console.log(req.body);
          let name = req.params.name;
          let points = req.params.points;
          console.log(name);
          console.log(points);
        json.push(
            {
                name: req.body.name,
                points: req.body.points
            }
        );

        console.log(json);

        // Write new Highscores
        fs.writeFile("routes/files/highscore.json", JSON.stringify(json), (err) => {
            if(err) {
              console.log("Error");
                res.status(500);
                return;
            }
            res.status(201);
        });
    });

});

module.exports = router;
