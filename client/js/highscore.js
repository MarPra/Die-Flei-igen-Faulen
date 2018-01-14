class Highscore{

  getHighscore(){
    $.ajax({
  			method: "GET",
  			dataType: "JSON",
  			url: apiURL + "highscore"
  		}).done((msg, err) => {
        if(err === 'success'){
          this.showHighscore(this.getBestScores(msg,5));
        }else {
          this.showHighscoreError();
        }
    });
  }

  setHighscore(){
    $.ajax({
  			type: "POST",
  			data: JSON.stringify({
  				"name": playerName,
  				"score": shootsCounter
  			}),
  			contentType: "application/json",
  			dataType: "JSON",
  			url: apiURL + "highscore",
  			success: this.getHighscore()
  });
  }

  getBestScores(highscores, nr) {
    console.log(highscores);
    highscores.sort(function(a,b){
      return a.score-b.score;
    });

    let bestScores = [];

    for(let i = 0; i < nr && i < highscores.length; i++){
      bestScores.push(highscores[i]);
    }
    return bestScores;
  }

  showHighscore(highscoreArray){
      let highscore = document.getElementById("Highscore");
      highscore.innerHTML = "";
      if(highscoreArray.length == 0) {
          highscore.innerHTML = "Kein Highscore verfügbar";
      }

      for(let i = 0; i < highscoreArray.length; i++){
        let score = document.createElement("p");
        score.innerHTML = i+1 + "." + highscoreArray[i].name + "  " + highscoreArray[i].score;
        let br = document.createElement("br");
        score.appendChild(br);
        highscore.appendChild(score);
      }
  }

  showHighscoreError(){
    let highscore = document.getElementById("Highscore");
        highscore.innerHTML = "Kein Highscore verfügbar";
  }
}
