class ngnAPL extends Lang {

    static getAddress(localhost) {
        return false;
    }

    static updateDisp(line) {
        let curr = disp[line];

        if (disp[line].isEmpty == true) {
            updateLine(line, "");
            return;
        }

        if (getLineNumber() == line) {
            updateLine(line, curr);
            return;
        }

        // updateLine(line, disp[line].split('\n').join(' ⋄ '));
        if (curr.indexOf('\n') > -1) {
            updateLine(line, "﹥ " + curr.slice(0, curr.indexOf('\n')));
            return;
        }
        updateLine(line, curr);
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
                let result = format(apl(prog));
                disp[i] = result;
                lang.updateDisp(i);
            }
            else {
                disp[i] = {isEmpty: true};
                lang.updateDisp(i);
            }
        }

        // document.getElementById('output').innerHTML = ...;

    }
}