class Brainfuck extends Lang {

    static getAddress(localhost) {
        return false;
    }

    static input(code = true) {
        let program = document.getElementById('left').value;
        let lines = document.getElementById('left').value.split('\n');
        console.log("lines: ", lines.length)
        console.log("disp: ", disp.length)
        console.log("right: ", document.getElementById('right').children.length)
        
        let res = RunBF.runLines(program);

        for (let i=0; i<lines.length; i++) {
            if (!lang.isIgnore(lines[i])) {
                disp[i] = res.disp[i][0];
            }
            else {
                disp[i] = {isEmpty: true};
            }
            console.log(i)
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