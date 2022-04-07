class Brainfuck extends Lang {

    static name = "brainfuck";
    static settings = `
    <label for="n">Cells</label>
    <br>
    <input onchange="updateSettings()" type="number" name="n" id="n" value="5" min="0" max="9">
    <br>
    <label for="padding">Padding</label>
    <br>
    <input onchange="updateSettings()" type="number" name="padding" id="padding" value="4" min="0" max="9">
    <br>
    <label for="cars">Display</label>
    <select onchange="updateSettings()" name="dispEndpoints" id="dispEndpoints">
    <option value="fixed">Fixed</option>
    <option value="sticky">Sticky</option>
    <!-- <option value="sticky" selected>Sticky</option> -->
    <option value="centered">Centered</option>
    <option value="elastic">Elastic</option>
    </select>
    `
    ;

    static getAddress(localhost) {
        return false;
    }

    static updateDisp(line) {
        let item = disp[line];
        if (item.type == "Empty") {
            updateLine(line, "");
        }

        else if (item.type == "BFState") {
            let pprinted = RunBF.pprint(item.tape, item.ptr, item.sticky);

            // clumsy overflow handling, with arbitrary hardcoded limits to keep it from spilling over
            if (pprinted.length > 35) {                                // temp
                // updateLine(line, pprinted.slice(0,22) + " ...");       // temp
                updateLine(line, "...")
                return;                                                // temp
            }

            updateLine(line, pprinted);
        }
    }

    static input(code = true) {
        let program = document.getElementById('left').value;
        let lines = document.getElementById('left').value.split('\n');
        let right = document.getElementById('right').children;
        
        let res = RunBF.runLines(program);

        // this logic should be taken care of somewhere else
        for (let i=0; i<lines.length; i++) { if (i>right.length-1) { document.getElementById('right').innerHTML += "<div class='row-wrapper'><div class='row'></div></div>"; }}

        for (let i=0; i<right.length; i++) {
            if (i<lines.length && !lang.isIgnore(lines[i])) {
                let val = res.disp[i][0];
                disp[i] = {type: "BFState", tape: val.tape, ptr: val.ptr, sticky: val.sticky};
            }
            else {
                disp[i] = {type: "Empty"}
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