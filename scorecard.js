const request = require("request");
const chalk = require("chalk");
const cheerio = require("cheerio");

function getInfoFromScorecard(url) {
  //   console.log(url);
  // we are having the url of a particular score card and now we want the html of the score card
  request(url, cb);
}
function cb(err, res, body) {
  if (err) {
    console.log("error is:  " + err);
  } else {
    getMatchDetalis(body);
  }
}
function getMatchDetalis(html) {
  // selectTool contains the html of the ith scorecard
  let selectTool = cheerio.load(html);
  //   1)- get venue information
  let desc = selectTool(".match-header-info.match-info-MATCH");
  //   console.log(chalk.blue(desc.text()));
  let descSplitted = desc.text().split(",");
  // console.log(descSplitted);
  // as we can see venue is apearing in the 1 index of descSplitted array so we will print that
  console.log("Details of match : ");
  console.log(chalk.blue("Venue: " + descSplitted[1]));
  // 2)- get date information: as we can see that date info is appearing in the 2 index of descSplitted array so we will print that
  console.log(chalk.yellow("Date: " + descSplitted[2]));

  // 3)- get team names
  let teamArray = selectTool(".name-link>.name");
  //  console.log(teamArray.text());
  let team1 = selectTool(teamArray[0]).text();//jab jab array ki index loge to selectTool duabara lagana padega kyuki .load karaenge cheerio ke thorugh📓 📓 📓 
  let team2 = selectTool(teamArray[1]).text();
  console.log(chalk.green.bold(team1 + " V/S " + team2));
  // 4)- get results of the match
  let results = selectTool(
    ".match-info.match-info-MATCH.match-info-MATCH-half-width>.status-text"
  );
  console.log(chalk.bgRed(results.text()));

  // 5)- get INNINGS (only batting table)
   let battingTableArray = selectTool(".table.batsman tbody>tr");
   console.log(battingTableArray.text()); 
}
// exporting the getInfoFromScorecard function
module.exports = {
  gifs: getInfoFromScorecard,
};
