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

    static dispEndpointsFixed(ptr, sticky) {
        return [0, RunBF.n];
    }

    static dispEndpointsElastic(ptr, sticky) {
        console.log(ptr)
        if (ptr > RunBF.n-1) {
            let diff = ptr - (RunBF.n-1);
            // return dispEndpointsFixed(ptr).map(x => x+diff);
            return [diff, RunBF.n+diff]
        }
        if (ptr < 0) {
            let diff = 0 - ptr;
            // return dispEndpointsFixed(ptr).map(x => x+diff);
            return [diff, RunBF.n+diff]
        }
        // return dispEndpointsFixed(ptr);
        return [0, RunBF.n];
    }

    static dispEndpointsSticky(ptr, sticky) {
        // return dispEndpointsFixed(ptr).map(x => x+sticky);
        return [sticky, sticky+RunBF.n];
    }

    static dispEndpointsCentered(ptr, sticky) {
        let half = (RunBF.n-1)/2;
        let smallHalf = Math.floor(half)
        let bigHalf = Math.ceil(half)+1;
        return [ptr-smallHalf, ptr+bigHalf]
    }

    static repr(tape, ptr, sticky) {
        // return JSON.stringify({tape: "["+tape.slice(0,4).join(", ")+"]", ptr: ptr});
        return {tape: tape.slice(0,10), ptr: ptr, sticky: sticky};
    }

    static pprint(tape, ptr, sticky) {
        // return tape.slice(0, n).join(' ')
        let acc = "";
        
        let [dispStart, dispEnd] = RunBF.dispEndpoints(ptr, sticky);
        for (let i = dispStart; i<dispEnd; i++) {
            let wrap = (i+256) % 256
            if (tape[wrap] == 0 ) {
                acc += "_".padStart(RunBF.padding, ' ');
            }
            // not included above because it's...          // temp
            else if (tape[wrap] == undefined ) {           // temp
                acc += "_".padStart(RunBF.padding, ' ');   // temp
            }                                              // temp
            else {
                acc += String(tape[wrap]).padStart(RunBF.padding, ' ');
            }
            acc += wrap==ptr? "* ": "  ";
        }
        acc += "\n";
        return acc;
    }


    static codeTable = {
        '+': 'tape[ptr] = (tape[ptr] + 1) % cellLimit',
        '-': 'tape[ptr] = tape[ptr] ? tape[ptr] - 1 : cellLimit - 1',
        '>': 'ptr = (ptr + 1) % tapeLimit',
        // '<': 'ptr = ptr ? ptr - 1 : Number.isFinite(tapeLimit) ? tapeLimit - 1 : tape.unshift(0) && 0',
        '<': 'ptr = ptr ? ptr - 1 : tapeLimit - 1',
        '[': 'while(tape[ptr]){',
        ']': '}',
        '.': 'output += String.fromCharCode(tape[ptr])',
        ',': 'tape[ptr] = input.shift().charCodeAt()',
        //   '`': 'disp += pprint(tape, ptr, sticky)',
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
        let tape = new Array(256).fill(0), ptr = 0, tapeLimit = Infinity, cellLimit = 256, output = "", disp = [[], [], [], []];
        let sticky = 0;
        let loopCounters = [0];
        RunBF.loopMax = 256;
        tape[ptr] = tape[ptr] ? tape[ptr] - 1 : cellLimit - 1
        // tape[ptr] = 100;
        // tape[ptr] = (tape[ptr] + 1) % cellLimit
        // tape[ptr] = (tape[ptr] + 1) % cellLimit
        // tape[ptr] = (tape[ptr] + 1) % cellLimit
        // tape[ptr] = (tape[ptr] + 1) % cellLimit
        disp[0].push(RunBF.pprint(tape, ptr, sticky))
        while(tape[ptr]) {
            if (loopCounters[0] > RunBF.loopMax) {
                console.log(`Exceeded loopMax of ${RunBF.loopMax}. To run anyway, change loopMax in console.`);
                break;
            }
            loopCounters[0]++;
            // console.log(loopCounters)
            disp[1].push(RunBF.pprint(tape, ptr, sticky))
            // tape[ptr] = tape[ptr] ? tape[ptr] - 1 : cellLimit - 1
            disp[2].push(RunBF.pprint(tape, ptr, sticky))
            // tape[ptr] = 0;
        }
        disp[3].push(RunBF.pprint(tape, ptr, sticky))
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

        let tape = new Array(RunBF.n).fill(0), ptr = 0, tapeLimit = Infinity, cellLimit = 256, output = "", disp = [];
        let sticky = 0;
    input = [...input];
    let transpiled = RunBF.transpile(code);
    eval(transpiled);
    disp = RunBF.repr(tape, ptr, sticky);
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
        let tape = new Array(256).fill(0), ptr = 0, tapeLimit = Infinity, cellLimit = 256, output = "", disp = RunBF.emptyArray(lines.length);
        let sticky = 0;
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
                if (lines[i][j] == ">") {
                    transpiled += `\nif (ptr >= sticky + RunBF.n) { sticky++; }\n`;
                }
                if (lines[i][j] == "<") {
                    transpiled += `\nif (ptr < sticky) { sticky--; }\n`;
                }
                // transpiled += transpile(lines[i]);
            }
            transpiled += `\ndisp[${i}].push(RunBF.repr(tape, ptr, sticky))\n`;
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

        // const readline = require('readline').createInterface({
        //     input: process.stdin,
        //     output: process.stdout
        // })

        // var repl = function() {
        // readline.question("", function(answer) {
        //     console.log(RunBF.bf(answer));
        //     repl();
        // });
        // }

        // repl();
    }
}

// RunBF.main();

// RunBF.dispEndpoints = RunBF.dispEndpointsSticky;
// let program = `++>+++>++++>++>+
// >>
// <
// `;
// let state = RunBF.runLines(program).disp;
// state = state[state.length-1][0];
// console.log(RunBF.pprint(state.tape, state.ptr, state.sticky));

// console.log(RunBF.bf("++>+"))

// RunBF.test();

// let k = "]][-[]+[]]";
// console.log(RunBF.removeMismatchedBrackets(k));