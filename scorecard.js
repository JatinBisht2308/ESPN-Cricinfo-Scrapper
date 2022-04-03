const request = require("request");
const chalk = require("chalk");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
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
  let matchVenue = descSplitted[1];
  console.log(chalk.blue("Venue: " + descSplitted[1]));
  // 2)- get date information: as we can see that date info is appearing in the 2 index of descSplitted array so we will print that
  let matchDate = descSplitted[2];
  console.log(chalk.yellow("Date: " + descSplitted[2]));

  // 3)- get team names
  let teamArray = selectTool(".name-link>.name");
  //  console.log(teamArray.text());
  let team1 = selectTool(teamArray[0]).text(); //jab jab array ki index loge to selectTool duabara lagana padega kyuki .load karaenge cheerio ke thorugh📓 📓 📓
  let team2 = selectTool(teamArray[1]).text();
  console.log(chalk.green.bold(team1 + " V/S " + team2));
  // 4)- get results of the match
  let matchResults = selectTool(
    ".match-info.match-info-MATCH.match-info-MATCH-half-width>.status-text"
  );
  let results = matchResults.text();
  console.log(chalk.bgRed(matchResults.text()));

  console.log(
    "🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫🛫"
  );
  // 5)- get INNINGS (only batting table)
  let allBatsmanTable = selectTool(".table.batsman tbody");
  // console.log("Number of batsman tables are:->" + allBatsmanTable.length);
  let batsmanHtml = "";
  //  console.log(selectTool(allBatsmanRows[0]).text());//this is the first column of the table
  //  console.log(allBatsmanRows.text());
  // for getting the name array of the batsaman
  // let batsmanNames = selectTool(".table.batsman tbody>tr>.batsman-cell");
  // let count = 1;
  // console.log(
  //   " Name " +
  //     " | " +
  //     " Runs " +
  //     " | " +
  //     " Balls " +
  //     " | " +
  //     " 4's " +
  //     " | " +
  //     " 6's " +
  //     " | " +
  //     " SR "
  // );
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

        // console.log(
        //   chalk.blue(playerName + "\t") +
        //     "|" +
        //     chalk.green(runs + "\t") +
        //     "|" +
        //     chalk.yellow(balls + "\t") +
        //     "|" +
        //     chalk.red(fours + "\t") +
        //     "|" +
        //     chalk.red(sixes + "\t") +
        //     "|" +
        //     chalk.bgWhiteBright(sr + "\t")
        // );
        // calling the function processInfo()
        processInfo(
          matchVenue,
          matchDate,
          results,
          team1,
          team2,
          playerName,
          runs,
          balls,
          fours,
          sixes,
          sr
        );
      }
    }
  }

  // Making a ffunction that helps in making team directories and saving there data in it.
  function processInfo(
    venue,
    date,
    results,
    team1,
    team2,
    playerName,
    runs,
    balls,
    fours,
    sixes,
    strikeRate
  ) {
    // Pasting the data to the IPL directory with the help of below code
    // 📓📓 📓 📓 📓 📓 Note of __dirname
    let teamNamePath = path.join(__dirname, "IPL", team1);
    if (!fs.existsSync(teamNamePath)) {
      fs.mkdirSync(teamNamePath);
    }

    let xcelPlayerPath = path.join(teamNamePath, playerName + ".xlsx");
    let content = excelReader(xcelPlayerPath, playerName);
    // here our content is an empty array that we get form the excelReader function
    let playerObj = {
      venue,
      date,
      results,
      team1,
      team2,
      playerName,
      runs,
      balls,
      fours,
      sixes,
      strikeRate,
    };

    // now we push data to the empty conetent array(and this become array of objects)
    content.push(playerObj);
    // then pass this content array to make an xlsx file as playername.xlsx
    excelWriter(xcelPlayerPath, content, playerName);
  }
}
// defination of function excelReader
function excelReader(playerPath, playerName) {
  if (!fs.existsSync(playerPath)) {
    // returing an empty array
    return [];
  }
  
}
// defining the function excelWriter
function excelWriter(playerPath, jsObjectData, playerSheetName) {
  // content is in json format(will study further)
  // Creates a new workBook📓📓📓 (notes of everything inside this function..)
  let newWorkBook = xlsx.utils.book_new();
  // Making a sheet in workBook:Converts an array of JS objects to a worksheet.
  let newWorkSheet = xlsx.utils.json_to_sheet(jsObjectData);
  // Append a worksheet to a workbook
  xlsx.utils.book_append_sheet(newWorkBook, newWorkSheet, playerSheetName);
  // Attempts to write or download workbook data to file(i.e the playerPath)
  xlsx.writeFile(newWorkBook, playerPath);
}
// 📓📓📓📓📓📓.writeFileSync ke note banao
// fs.writeFileSync("J:/Pepcoding_Course/Web_Development/Live_Class/Project_4/Web_Scrapper/espn_scrapper/innings.html",batsmanHtml);

// exporting the getInfoFromScorecard function
module.exports = {
  gifs: getInfoFromScorecard,
};
