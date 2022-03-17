class Brainfuck extends Lang {

    static getAddress(localhost) {
        return false;
    }

    static input(code = true) {
        let lines = document.getElementById('left').value.split('\n');
        
        let program = ""
        for (const line of lines) {
            program += line;
            if (!lang.isIgnore(line)) {
                program += '`';
                // program += "output += pprint(tape, tapeIndex)";
            }
            else {
                program += '~';
                // program += "output += '\\n'";
            }
        }
        let res = bf(program, '')
        document.getElementById('right').innerHTML = res.disp;
        // document.getElementById('output').innerHTML = res.output;
    }
}