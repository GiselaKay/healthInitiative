
function calculatePoints(activityValue,entryValue){
  var totalpoints=activityValue*entryValue;
  return totalpoints;
}
var pointWeeklyTotal;
var pointsSubmitted= function(){
var transportAV = 10;
var dailyWOAV = 15;
var meditationAV = 15;
var soloWOAV = 15;
var stairsAV = 2;
var waterAV = 2;    
var transportTotal = calculatePoints(transportAV,transport.value);
var dailyWOTotal = calculatePoints(dailyWOAV,dailyWO.value);
var meditationTotal = calculatePoints(meditationAV,meditation.value);
var soloWOPVTotal = calculatePoints(soloWOAV,solowo.value);
var stairsTotal = calculatePoints(stairsAV,stairs.value);
var waterTotal = calculatePoints(waterAV,water.value);
var pointInputTotal = transportTotal+dailyWOTotal+meditationTotal+soloWOPVTotal+stairsTotal+waterTotal;


if (name.length === 0)
        return;
      
var userScoreRef = scoreListRef.child(name);
console.log("if i no wrky");

      // if(htmlForPath[name] != undefined)
      // {
      //   console.log("i'm old","pointWeeklyTotal:",pointWeeklyTotal,"pointInputTotal;",pointInputTotal );
      //   pointWeeklyTotal += pointInputTotal;

      // }else{
      //   pointWeeklyTotal=pointInputTotal;
      //   console.log("im new","pointWeeklyTotal:",pointWeeklyTotal,"pointInputTotal;",pointInputTotal);
      // }

      // Use setWithPriority to put the name / score in Firebase, and set the priority to be the score.
      
      // userScoreRef.setWithPriority({ name:name, score: pointInputTotal}, pointInputTotal);



      // Track the highest score using a transaction.  A transaction guarantees that the code inside the block is
      // executed on the latest data from the server, so transactions should be used if you have multiple
      // clients writing to the same data and you want to avoid conflicting changes.
      // highestScoreRef.transaction(function (currentHighestScore) {
      //   if (currentHighestScore === null || newScore > currentHighestScore) {
      //     // The return value of this function gets saved to the server as the new highest score.
      //     // return newScore;
      //   }
      //   // if we return with no arguments, it cancels the transaction.
      //   // return;
      // });

}
var LEADERBOARD_SIZE = 1000;//Need to change to amt of students


  // Build some firebase references.
  var rootRef = new Firebase('https://hrhitest.firebaseio.com/ ');
  var scoreListRef = rootRef.child("scoreList");
  var highestScoreRef = rootRef.child("highestScore");
  var htmlForPath = {};

  // Keep a mapping of firebase locations to HTML elements, so we can move / remove elements as necessary.
 
  // Helper function that takes a new score snapshot and adds an appropriate row to our leaderboard table.
  function handleScoreAdded(scoreSnapshot, prevScoreName) {
    var newScoreRow = $("<tr/>");
    // variable = row 
    newScoreRow.append($("<td/>").append($("<em/>").text(scoreSnapshot.val().name)));
    // append row/newScoreRow with tableCell/td. Append tableCell/td with bold/em for text of scoreSnapshots value of the name
    newScoreRow.append($("<td/>").text(scoreSnapshot.val().score));
    // append row/newscorerow with tablecell/td for text of scoreSnapshots value of the score
    // Store a reference to the table row so we can get it again later.
    htmlForPath[scoreSnapshot.name()] = newScoreRow;

    // Insert the new score in the appropriate place in the table.
    if (prevScoreName === null) {
      $("#leaderboardTable").append(newScoreRow);
    }
    else {
      var lowerScoreRow = htmlForPath[prevScoreName];
      lowerScoreRow.before(newScoreRow);
    }
  }

  // Helper function to handle a score object being removed; just removes the corresponding table row.
  function handleScoreRemoved(scoreSnapshot) {
    var removedScoreRow = htmlForPath[scoreSnapshot.name()];
    removedScoreRow.remove();
    delete htmlForPath[scoreSnapshot.name()];
  }

  // Create a view to only receive callbacks for the last LEADERBOARD_SIZE scores
  var scoreListView = scoreListRef.limit(LEADERBOARD_SIZE);

  // Add a callback to handle when a new score is added.
  scoreListView.on('child_added', function (newScoreSnapshot, prevScoreName) {
    handleScoreAdded(newScoreSnapshot, prevScoreName);
  });

  // Add a callback to handle when a score is removed
  scoreListView.on('child_removed', function (oldScoreSnapshot) {
    handleScoreRemoved(oldScoreSnapshot);
  });

  // Add a callback to handle when a score changes or moves positions.
  var changedCallback = function (scoreSnapshot, prevScoreName) {
    handleScoreRemoved(scoreSnapshot);
    handleScoreAdded(scoreSnapshot, prevScoreName);
  };
  scoreListView.on('child_moved', changedCallback);
  scoreListView.on('child_changed', changedCallback);

  // When the user presses enter on scoreInput, add the score, and update the highest score.