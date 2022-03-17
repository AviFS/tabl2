const { inherits } = require('util');

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



let bf = (code, input = '') => {
    function init() {
        tape = new Array(n).fill(0), tapeIndex = 0, tapeLimit = Infinity, cellLimit = 256, output = '';
    }
    code = [...code];
    let start_indices = [];
    for (let i = 0; i < code.length; i++) {
      if (code[i] == '[') start_indices.push(i);
      if (code[i] == ']') start_indices.pop();
    }
    code = code.filter((char, i) => !start_indices.includes(i))

    var tape, tapeIndex, tapeLimit, cellLimit, output;
    init();
  input = [...input];
  let codeTable = {
      '+': 'tape[tapeIndex] = (tape[tapeIndex] + 1) % cellLimit',
      '-': 'tape[tapeIndex] = tape[tapeIndex] ? tape[tapeIndex] - 1 : cellLimit - 1',
      '>': 'tapeIndex = (tapeIndex + 1) % tapeLimit',
      '<': 'tapeIndex = tapeIndex ? tapeIndex - 1 : Number.isFinite(tapeLimit) ? tapeLimit - 1 : tape.unshift(0) && 0',
      '[': 'while(tape[tapeIndex]){',
      ']': '}',
      '.': 'output += String.fromCharCode(tape[tapeIndex])',
      ',': 'tape[tapeIndex] = input.shift().charCodeAt()',
      '#': 'output += pprint(tape, tapeIndex)',
  }
  let transpiled = '';
  for(let char of code){
      if(char in codeTable){
          transpiled += codeTable[char] + '\n'
      }
  }
  eval(transpiled);
  output += pprint(tape, tapeIndex);
    return output;
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

main();

// console.log(bf("++>+"))