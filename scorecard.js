const request = require("request");
const chalk = require("chalk");
const cheerio = require("cheerio");
const fs = require("fs");
const { log } = require("console");
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
  let team1 = selectTool(teamArray[0]).text(); //jab jab array ki index loge to selectTool duabara lagana padega kyuki .load karaenge cheerio ke thorugh📓 📓 📓
  let team2 = selectTool(teamArray[1]).text();
  console.log(chalk.green.bold(team1 + " V/S " + team2));
  // 4)- get results of the match
  let results = selectTool(
    ".match-info.match-info-MATCH.match-info-MATCH-half-width>.status-text"
  );
  console.log(chalk.bgRed(results.text()));

  // 5)- get INNINGS (only batting table)
  let allBatsmanTable = selectTool(".table.batsman tbody");
  // console.log("Number of batsman tables are:->" + allBatsmanTable.length);
  let batsmanHtml = "";
  //  console.log(selectTool(allBatsmanRows[0]).text());//this is the first column of the table
  //  console.log(allBatsmanRows.text());
  // for getting the name array of the batsaman
  // let batsmanNames = selectTool(".table.batsman tbody>tr>.batsman-cell");
  // let count = 1;
  console.log(
    "\n\n🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫\n\n"
  );
  console.log();
  for (let i = 0; i < allBatsmanTable.length; i++) {
    // concatinating both teams batsman table in htmlString
    batsmanHtml += selectTool(allBatsmanTable[i]).html();
    // Selecting filtered rows from the batsman table
    let allRows = selectTool(allBatsmanTable[i]).find("tr"); //-> batsman data + empty rows
    for (let i = 0; i < allRows.length; i++) {
      let selectedTdInsideTr = selectTool(allRows[i]).find("td");
      // 📓📓📓📓📓📓.hasClass ka notes bana lo
      if (selectTool(selectedTdInsideTr).hasClass("batsman-cell")) {
        //  valid data entry point i.e-> Name | runs | balls | 4's | 6's | strikerate of batsman
        // console.log("inside" + count);
        // count++;
        // 1)- Name
        let playerName = selectTool(selectedTdInsideTr[0]).text();
        // 2)- runs
        let runs = selectTool(selectedTdInsideTr[2]).text();
        // 3)- balls
        let balls = selectTool(selectedTdInsideTr[3]).text();
        // 4)- fours
        let fours = selectTool(selectedTdInsideTr[5]).text();
        // 5)- sixes
        let sixes = selectTool(selectedTdInsideTr[6]).text();
        console.log();
        // 6)- strike rate
        let sr = selectTool(selectedTdInsideTr[7]).text();

        console.log(
          chalk.blue("Name: " + playerName) +
            "|" +
            chalk.green("Runs:->" + runs) +
            "|" +
            chalk.yellow("Balls:->" + balls) +
            "|" +
            chalk.red("4's:->" + fours) +
            "|" +
            chalk.red("6's:->" + sixes) +
            "|" +
            chalk.bgWhiteBright("SR:->" + sr)
        );
      }
    }
  }
  console.log(
    "\n\n🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫\n\n"
  );
  // 📓📓📓📓📓📓.writeFileSync ke note banao
  // fs.writeFileSync("J:/Pepcoding_Course/Web_Development/Live_Class/Project_4/Web_Scrapper/espn_scrapper/innings.html",batsmanHtml);
}
// exporting the getInfoFromScorecard function
module.exports = {
  gifs: getInfoFromScorecard,
};
