// const readline = require('readline');
// const fs = require('fs');

// const rl = readline.createInterface({
//   input: fs.createReadStream("./units.txt")
// });

// // let results = [];
// rl.on('line', (line) => {
//     // if (line.includes("foot")) {
//         // results.push(line);
//         console.log(`"${line}", `)
//     // }

// });

// const Units = require("./sorted-units");

function getUnit(unit) {
  return Units.standalone[unit];
}

function lastWord(str) {
  return str.slice(str.lastIndexOf(' ')+1);
} 

function recursiveGetUnit(unit) {
  let value = getUnit(unit);
  if (value == undefined) {
    return [];
  }
  let next = lastWord(value);
  return [value].concat(recursiveGetUnit(next));
}

// for (const line of units) {
//   if (line.includes()) {
//     console.log(line)
//   }
// }

// console.log(recursiveGetUnit('yard'))