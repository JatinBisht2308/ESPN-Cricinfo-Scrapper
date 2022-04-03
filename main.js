const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
// requiring the allMatch file
const allMatch = require("./allMatch");


let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

request(url, cb);

function cb(err, res, body) {
  if (err) {
    console.error("error is: " + err);
  } else {
    //  print the body of the data
    handleHtml(body);
  }
}
function handleHtml(body) {
  let selectTool = cheerio.load(body);
  let anchorElements = selectTool('a[data-hover="View All Results"]');
  // console.log(anchorElements);

  // getting the full link of the all results of matches
  // 📓 📓 📓 .attr ka notes bana 📓 📓 📓
  // .attr() is the method of cheerio (Method for getting attributes. Gets the attribute value for only the first element in the matched set.)
  let relativeLink = anchorElements.attr("href");
  // console.log(relativeLink);
  let fullLink = "https://www.espncricinfo.com" + relativeLink;
  // console.log(fullLink);
  //    Getting the all matches
  let totalMatches = allMatch.getAllMatch(fullLink);
}

// This will create the IPL directory in espn_scrapper dir
let iplPath = path.join(__dirname,"IPL");
if(!fs.existsSync(iplPath)){
  fs.mkdirSync(iplPath);
}