// const { inherits } = require('util');

let n = 5;

function pprint(tape, tapeIndex) {
    // return tape.slice(0, n).join(' ')
    let acc = "";
    for (let i = 0; i<n; i++) {
        if (tape[i] == 0 ) {
            acc += "_".padStart(3, ' ');
        }
        else {
            acc += String(tape[i]).padStart(3, ' ');
        }
        acc += i==tapeIndex? "* ": "  ";
    }
    acc += "\n";
    return acc;
}


function transpile(code) {
  let codeTable = {
      '+': 'tape[tapeIndex] = (tape[tapeIndex] + 1) % cellLimit',
      '-': 'tape[tapeIndex] = tape[tapeIndex] ? tape[tapeIndex] - 1 : cellLimit - 1',
      '>': 'tapeIndex = (tapeIndex + 1) % tapeLimit',
      '<': 'tapeIndex = tapeIndex ? tapeIndex - 1 : Number.isFinite(tapeLimit) ? tapeLimit - 1 : tape.unshift(0) && 0',
      '[': 'while(tape[tapeIndex]){',
      ']': '}',
      '.': 'output += String.fromCharCode(tape[tapeIndex])',
      ',': 'tape[tapeIndex] = input.shift().charCodeAt()',
      '`': 'disp += pprint(tape, tapeIndex)',
      '~': 'disp += "\\n"',
  }
  let transpiled = '';
  for(let char of code){
      if(char in codeTable){
          transpiled += codeTable[char] + '\n'
      }
  }
  return transpiled;
}

function test() {
    let tape = new Array(n).fill(0), tapeIndex = 0, tapeLimit = Infinity, cellLimit = 256, output = "", disp = [[], [], [], []];
    tape[tapeIndex] = (tape[tapeIndex] + 1) % cellLimit
    tape[tapeIndex] = (tape[tapeIndex] + 1) % cellLimit
    tape[tapeIndex] = (tape[tapeIndex] + 1) % cellLimit
    disp[0].push(pprint(tape, tapeIndex))
    while(tape[tapeIndex]){
        disp[1].push(pprint(tape, tapeIndex))
        tape[tapeIndex] = tape[tapeIndex] ? tape[tapeIndex] - 1 : cellLimit - 1
        disp[2].push(pprint(tape, tapeIndex))
    }
    disp[3].push(pprint(tape, tapeIndex))
    console.log(disp)
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
  console.log(transpiled)
    return {"disp": disp, "output": output};
}

function runLines(lines, input='') {
    let tape = new Array(n).fill(0), tapeIndex = 0, tapeLimit = Infinity, cellLimit = 256, output = "", disp = emptyArray(lines.length);
  input = [...input];

    transpiled = ""
    for (let i=0; i<lines.length; i++) {
        transpiled += transpile(lines[i]);
        transpiled += `\ndisp[${i}].push(pprint(tape, tapeIndex))\n`;
    }
    eval(transpiled)
    console.log(transpiled)
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