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

let bases = ["m", "s", "kg", "A", "K", "dollar", "mol", "bit", "cd"];

function getUnit(unit) {
  let value = Units.standalone[unit];
  if (value != undefined) {
    return value;
  }

  for (const base of bases) {
    if (unit == base) {
      return undefined;
    }
    if (unit.slice(unit.length-base.length) == base) {
      return base;
      // let pre = unit.slice(0, unit.length-base.length);
      // return Units.prefix[pre] || Units.prefixStrict[pre];
  } 
  return undefined;

  }
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

console.log(recursiveGetUnit('yard'))