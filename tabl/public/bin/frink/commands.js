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

const units = require("./sorted-units").standalone;

console.log(units['cm'])

// for (const line of units) {
//   if (line.includes()) {
//     console.log(line)
//   }
// }