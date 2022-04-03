class ngnAPL extends Lang {

    static getAddress(localhost) {
        return false;
    }

    static updateDisp(line) {
        let item = disp[line];

        if (item.type == "Empty") {
            updateLine(line, "");
        }

        else if (item.type == "Static") {
            if (getLineNumber() == line) {
                updateLine(line, item.text);
                return;
            }

            // updateLine(line, item.text.split('\n').join(' ⋄ '));
            if (item.text.indexOf('\n') > -1) {
                updateLine(line, "﹥ " + item.text.slice(0, text.indexOf('\n')));
                return;
            }
            updateLine(line, item.text);
        }
    }

    static processAll() {
        for (let i=0; i <disp.length; i++) {
            ngnAPL.processDisp(disp, i)
        }
    }

    static input(code = true) {
        // let program = document.getElementById('left').value;
        let lines = document.getElementById('left').value.split('\n');
        
        function format(expr) { return apl.fmt(expr).join('\n'); }

        let right = document.getElementById('right').children;

        for (let i=0; i<right.length; i++) {
            if (i<lines.length && !lang.isIgnore(lines[i])) {
                let prog = lines.slice(0, i+1).join('\n')
                let result = {type: "Static", text: format(apl(prog))};
                disp[i] = result;
                lang.updateDisp(i);
            }
            else {
                disp[i] = {type: "Empty"};
                lang.updateDisp(i);
            }
        }

        // document.getElementById('output').innerHTML = ...;

    }
}