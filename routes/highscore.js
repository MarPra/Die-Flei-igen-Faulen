var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
//var db = /* Was soll man für eine DB verwenden? */;

router.get("/highscore", function(req, res, next){
  // Implementierung lesen aus DB
  // TODO: Sortierung, dass wenigsten Schüsse oben stehen
/*  db.highscore.find(function(err, highscore){
        if(err){
            res.send(err);
        }
        res.json(highscore);
    });*/
});

router.post("/highscore", function(req, res, next){
  // Implementierung speichern in DB
});

module.exports = router;
