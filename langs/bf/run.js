// const { inherits } = require('util');

class RunBF {
    static loopMax = 512;
    static n = 5;
    static padding = 4;
    static MAX_ITER = 512;
    static dispEndpoints = RunBF.dispEndpointsFixed;

    static dispMore(items = 7) {
        RunBF.padding = 3;
        RunBF.n = items;
    }

    static dispReset(items = 5) {
        RunBF.padding = 4;
        RunBF.n = items;
    }

    static dispEndpointsFixed(tapeIndex) {
        return [0, RunBF.n];
    }

    static dispEndpointsCentered(tapeIndex) {
        let smallHalf = Math.floor(RunBF.n/2);
        let bigHalf = Math.ceil(RunBF.n/2);
        return [tapeIndex-smallHalf, tapeIndex+bigHalf]
    }

    static repr(tape, tapeIndex) {
        // return JSON.stringify({tape: "["+tape.slice(0,4).join(", ")+"]", ptr: tapeIndex});
        return {tape: tape.slice(0,7), ptr: tapeIndex};
    }

    static pprint(tape, tapeIndex) {
        // return tape.slice(0, n).join(' ')
        let acc = "";
        
        let [dispStart, dispEnd] = RunBF.dispEndpoints(tapeIndex);
        for (let i = dispStart; i<dispEnd; i++) {
            let wrap = (i+256) % 256
            if (tape[wrap] == 0 ) {
                acc += "_".padStart(RunBF.padding, ' ');
            }
            else {
                acc += String(tape[wrap]).padStart(RunBF.padding, ' ');
            }
            acc += wrap==tapeIndex? "* ": "  ";
        }
        acc += "\n";
        return acc;
    }


    static codeTable = {
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

    static transpile(code) {

    let transpiled = '';
    for(let char of code){
        if(char in RunBF.codeTable){
            transpiled += RunBF.codeTable[char] + '\n'
        }
    }
    return transpiled;
    }

    static test() {
        let tape = new Array(256).fill(0), tapeIndex = 0, tapeLimit = Infinity, cellLimit = 256, output = "", disp = [[], [], [], []];
        let loopCounters = [0];
        RunBF.loopMax = 256;
        tape[tapeIndex] = tape[tapeIndex] ? tape[tapeIndex] - 1 : cellLimit - 1
        // tape[tapeIndex] = 100;
        // tape[tapeIndex] = (tape[tapeIndex] + 1) % cellLimit
        // tape[tapeIndex] = (tape[tapeIndex] + 1) % cellLimit
        // tape[tapeIndex] = (tape[tapeIndex] + 1) % cellLimit
        // tape[tapeIndex] = (tape[tapeIndex] + 1) % cellLimit
        disp[0].push(RunBF.pprint(tape, tapeIndex))
        while(tape[tapeIndex]) {
            if (loopCounters[0] > RunBF.loopMax) {
                console.log(`Exceeded loopMax of ${RunBF.loopMax}. To run anyway, change loopMax in console.`);
                break;
            }
            loopCounters[0]++;
            // console.log(loopCounters)
            disp[1].push(RunBF.pprint(tape, tapeIndex))
            // tape[tapeIndex] = tape[tapeIndex] ? tape[tapeIndex] - 1 : cellLimit - 1
            disp[2].push(RunBF.pprint(tape, tapeIndex))
            // tape[tapeIndex] = 0;
        }
        disp[3].push(RunBF.pprint(tape, tapeIndex))
        console.log(disp.map(x => x[0]).join(''))
    }

    static bf = (code, input = '') => {
        code = [...code];
        let start_indices = [];
        for (let i = 0; i < code.length; i++) {
        if (code[i] == '[') start_indices.push(i);
        if (code[i] == ']') start_indices.pop();
        }
        code = code.filter((char, i) => !start_indices.includes(i))

        let tape = new Array(RunBF.n).fill(0), tapeIndex = 0, tapeLimit = Infinity, cellLimit = 256, output = "", disp = [];
    input = [...input];
    let transpiled = RunBF.transpile(code);
    eval(transpiled);
    disp = RunBF.repr(tape, tapeIndex);
    //   console.log(transpiled)
        return {"disp": disp, "output": output};
    }

    // should test this function a bit more, but I think it works
    // eg. removeMismatchedBrackets("]][-[]+[]]") -> "[-[]+[]]"
    static removeMismatchedBrackets(code) {
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

    static count(string, char) {
        console.assert(char.length == 1);
        let acc = 0;
        for (const c of string) {
            if (c == char) { acc++; } 
        }
        return acc;
    }

    static runLines(code, input='') {

        code = RunBF.removeMismatchedBrackets(code);

        let lines = code.split('\n');
        let tape = new Array(256).fill(0), tapeIndex = 0, tapeLimit = Infinity, cellLimit = 256, output = "", disp = RunBF.emptyArray(lines.length);
        let loopCounts = new Array(RunBF.count(code, '[')).fill(0);
        let loopCountsInd = 0;

        input = [...input];

        let transpiled = ""
        for (let i=0; i<lines.length; i++) {
            for (let j=0; j<lines[i].length; j++) {
                if (lines[i][j] in RunBF.codeTable) {
                    transpiled += RunBF.codeTable[lines[i][j]] + "\n";
                }
                if (lines[i][j] == "[") {
                    let curr = `loopCounts[${loopCountsInd}]`
                    transpiled += `
                    if (${curr} > RunBF.MAX_ITER) {
                        console.warn("Exceeded MAX_ITER of ${RunBF.MAX_ITER}. To run anyway, change RunBF.MAX_ITER in console.");
                        break;
                    }
                    ${curr}++;
                    `
                    loopCountsInd++;
                }
                // transpiled += transpile(lines[i]);
            }
            transpiled += `\ndisp[${i}].push(RunBF.repr(tape, tapeIndex))\n`;
        }
        // console.log(transpiled);
        eval(transpiled);
        return {"disp": disp, "output": output};
    }

    static emptyArray(n) {
        // `return new Array(n).fill([])` fills by reference and doesn't behave properly
        return Array.from( new Array(n), (x) => []);
        // return [[],[],[],[]] *does* work and another version of this may be more efficient
    }

    static main() {

        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        })

        var repl = function() {
        readline.question("", function(answer) {
            console.log(RunBF.bf(answer));
            repl();
        });
        }

        repl();
    }
}

// RunBF.main();

// console.log(RunBF.bf("++>+"))

// RunBF.test();

// let k = "]][-[]+[]]";
// console.log(RunBF.removeMismatchedBrackets(k));