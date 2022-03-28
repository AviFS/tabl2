class Brainfuck extends Lang {

    static getAddress(localhost) {
        return false;
    }

    static input(code = true) {
        let program = document.getElementById('left').value;
        let lines = document.getElementById('left').value.split('\n');
        
        let res = RunBF.runLines(program);

        let display = ""
        for (let i=0; i<lines.length; i++) {
            if (!lang.isIgnore(lines[i])) {
                display += res.disp[i][0];
            }
            else {
                display += "\n";
            }
        }

        // document.getElementById('right').innerHTML = disp.map(x => x[0]).join('');
        document.getElementById('right').innerHTML = display;
        document.getElementById('output').innerHTML = res.output;

        // let program = ""
        // for (const line of lines) {
        //     program += line;
            // if (!lang.isIgnore(line)) {
            //     program += '`';
                // program += "output += pprint(tape, tapeIndex)";
            // }
            // else {
                // program += '~';
                // program += "output += '\\n'";
            // }
        // }
        // let res = bf(program, '')
        // document.getElementById('right').innerHTML = res.disp;
        // document.getElementById('output').innerHTML = res.output;
    }
}