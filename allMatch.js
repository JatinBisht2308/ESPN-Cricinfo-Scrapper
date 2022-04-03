const request = require("request");
const cheerio = require("cheerio");
const chalk = require("chalk");
// requiring the scorecard file because we will share the fullscorecardLink from this allMatch file
const scorecard = require("./scorecard");
// 📓 📓 📓 // alternative for abover statement
// const {gifs} = require("./scorecard")   📓 📓 📓

function cb(err, res, body) {
  if (err) {
    console.error("error is:" + err);
  } else {
    extractAllScoreCards(body);
  }
}

// function defination of handlehtml()
function extractAllScoreCards(html) {
  let selectTool = cheerio.load(html);
  let scoreCardElements = selectTool('a[data-hover="Scorecard"]');
  console.log(
    "Total matches played in 2020-21 ipl are:  " +
      chalk.blue(scoreCardElements.length)
  );

  for (let i = 0; i < scoreCardElements.length; i++) {
    
    let particularMatchCardLink = selectTool(scoreCardElements[i]).attr("href");
    //    console.log((i+1)+")- match link-> "+chalk.green(particularMatchCardLink));
    let particularMatchCardFullLink =
      "https://www.espncricinfo.com" + particularMatchCardLink;
    //    console.log((i+1)+")- match Full Link-> "+chalk.yellow(particularMatchCardFullLink));
    scorecard.gifs(particularMatchCardFullLink);
    // 📓 📓 📓   // alternative for requiring the object from another file
    // gifs(particularMatchCardFullLink); 📓 📓 📓
  }
}

function getAllMatch(url) {
  request(url, cb);
}

// exporting module to get the all matches function in the main.js
module.exports = {
  getAllMatch: getAllMatch,
};
