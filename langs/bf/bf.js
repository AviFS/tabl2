class Brainfuck extends Lang {

    static getAddress(localhost) {
        return false;
    }

    static updateDisp(line) {
        if (disp[line].isEmpty == true) {
            updateLine(line, "");
            return;
        }

        let val = disp[line];
        updateLine(line, RunBF.pprint(val.tape, val.ptr));
        return;
    }

    static input(code = true) {
        let program = document.getElementById('left').value;
        let lines = document.getElementById('left').value.split('\n');
        let right = document.getElementById('right').children;
        
        let res = RunBF.runLines(program);

        for (let i=0; i<right.length; i++) {
            if (!lang.isIgnore(lines[i])) {
                disp[i] = res.disp[i][0];
            }
            else {
                disp[i] = {isEmpty: true};
            }
        lang.updateDisp(i)
        }

        // document.getElementById('right').innerHTML = disp.map(x => x[0]).join('');
        // disp = display.split('\n');
        // console.log(disp)
        // lang.updateAllDisp();
        // document.getElementById('right').innerHTML = display;
        // document.getElementById('output').innerHTML = res.output;

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