// const { inherits } = require('util');

let loopMax = 512;
let n = 5;
let padding = 4;

function pprint(tape, tapeIndex) {
    // return tape.slice(0, n).join(' ')
    let acc = "";
    for (let i = 0; i<n; i++) {
        if (tape[i] == 0 ) {
            acc += "_".padStart(padding, ' ');
        }
        else {
            acc += String(tape[i]).padStart(padding, ' ');
        }
        acc += i==tapeIndex? "* ": "  ";
    }
    acc += "\n";
    return acc;
}


let codeTable = {
    '+': 'tape[tapeIndex] = (tape[tapeIndex] + 1) % cellLimit',
    '-': 'tape[tapeIndex] = tape[tapeIndex] ? tape[tapeIndex] - 1 : cellLimit - 1',
    '>': 'tapeIndex = (tapeIndex + 1) % tapeLimit',
    // '<': 'tapeIndex = tapeIndex ? tapeIndex - 1 : Number.isFinite(tapeLimit) ? tapeLimit - 1 : tape.unshift(0) && 0',
    '<': 'tapeIndex = tapeIndex ? tapeIndex - 1 : tapeLimit - 1',
    '[': 'while(tape[tapeIndex]){',
    ']': '}',
    '.': 'output += String.fromCharCode(tape[tapeIndex])',
    ',': 'tape[tapeIndex] = input.shift().charCodeAt()',
    //   '`': 'disp += pprint(tape, tapeIndex)',
    //   '~': 'disp += "\\n"',
}

function transpile(code) {

  let transpiled = '';
  for(let char of code){
      if(char in codeTable){
          transpiled += codeTable[char] + '\n'
      }
  }
  return transpiled;
}

function test() {
    let tape = new Array(256).fill(0), tapeIndex = 0, tapeLimit = Infinity, cellLimit = 256, output = "", disp = [[], [], [], []];
    let loopCounters = [0];
    loopMax = 256;
    tape[tapeIndex] = tape[tapeIndex] ? tape[tapeIndex] - 1 : cellLimit - 1
    // tape[tapeIndex] = 100;
    // tape[tapeIndex] = (tape[tapeIndex] + 1) % cellLimit
    // tape[tapeIndex] = (tape[tapeIndex] + 1) % cellLimit
    // tape[tapeIndex] = (tape[tapeIndex] + 1) % cellLimit
    // tape[tapeIndex] = (tape[tapeIndex] + 1) % cellLimit
    disp[0].push(pprint(tape, tapeIndex))
    while(tape[tapeIndex]) {
        if (loopCounters[0] > loopMax) {
            console.log(`Exceeded loopMax of ${loopMax}. To run anyway, change loopMax in console.`);
            break;
        }
        loopCounters[0]++;
        // console.log(loopCounters)
        disp[1].push(pprint(tape, tapeIndex))
        // tape[tapeIndex] = tape[tapeIndex] ? tape[tapeIndex] - 1 : cellLimit - 1
        disp[2].push(pprint(tape, tapeIndex))
        // tape[tapeIndex] = 0;
    }
    disp[3].push(pprint(tape, tapeIndex))
    console.log(disp.map(x => x[0]).join(''))
}

let bf = (code, input = '') => {
    code = [...code];
    let start_indices = [];
    for (let i = 0; i < code.length; i++) {
      if (code[i] == '[') start_indices.push(i);
      if (code[i] == ']') start_indices.pop();
    }
    code = code.filter((char, i) => !start_indices.includes(i))

    let tape = new Array(n).fill(0), tapeIndex = 0, tapeLimit = Infinity, cellLimit = 256, output = "", disp = [];
  input = [...input];
  transpiled = transpile(code);
  eval(transpiled);
//   console.log(transpiled)
    return {"disp": disp, "output": output};
}

// should test this function a bit more, but I think it works
// eg. removeMismatchedBrackets("]][-[]+[]]") -> "[-[]+[]]"
function removeMismatchedBrackets(code) {
    let matchedBrackets = [];
    let openIndices = [];
    for (let i=0; i<code.length; i++) {
        if (code[i] == '[') {
            openIndices.push(i);
        }
        if (code[i] == ']') {
            if (openIndices.length != 0) {
                let openingBracket = openIndices.pop();
                let closingBracket = i;
                matchedBrackets.push(openingBracket, closingBracket);
            }
        }
    }
    code = [...code];
    code = code.filter(function (char, i) {
        if (char == "[" || char == "]") {
            return matchedBrackets.includes(i);
        }
        return true;
    });
    return code.join('');
}

function count(string, char) {
    console.assert(char.length == 1);
    let acc = 0;
    for (const c of string) {
        if (c == char) { acc++; } 
    }
    return acc;
}

function runLines(code, input='') {

    code = removeMismatchedBrackets(code);

    let lines = code.split('\n');
    let tape = new Array(n).fill(0), tapeIndex = 0, tapeLimit = Infinity, cellLimit = 256, output = "", disp = emptyArray(lines.length);
    let loopCounts = new Array(count(code, '[')).fill(0);
    let loopCountsInd = 0;
    let MAX_ITER = 512;

    input = [...input];

    let transpiled = ""
    for (let i=0; i<lines.length; i++) {
        for (let j=0; j<lines[i].length; j++) {
            if (lines[i][j] in codeTable) {
                transpiled += codeTable[lines[i][j]] + "\n";
            }
            if (lines[i][j] == "[") {
                curr = `loopCounts[${loopCountsInd}]`
                transpiled += `
                if (${curr} > MAX_ITER) {
                    console.warn("Exceeded MAX_ITER of ${MAX_ITER}. To run anyway, change MAX_ITER in console.");
                    break;
                }
                ${curr}++;
                `
                loopCountsInd++;
            }
            // transpiled += transpile(lines[i]);
        }
        transpiled += `\ndisp[${i}].push(pprint(tape, tapeIndex))\n`;
    }
    // console.log(transpiled);
    eval(transpiled);
    return {"disp": disp, "output": output};
}

function emptyArray(n) {
    // `return new Array(n).fill([])` fills by reference and doesn't behave properly
    return Array.from( new Array(n), (x) => []);
    // return [[],[],[],[]] *does* work and another version of this may be more efficient
}

function main() {

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    })

    var repl = function() {
    readline.question("", function(answer) {
        console.log(bf(answer));
        repl();
    });
    }

    repl();
}

// main();

// console.log(bf("++>+"))

// test();

// let k = "]][-[]+[]]";
// console.log(removeMismatchedBrackets(k));