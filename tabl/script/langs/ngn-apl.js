class ngnAPL extends Lang {

    static getAddress(localhost) {
        return false;
    }

    static input(code = true) {
        // let program = document.getElementById('left').value;
        let lines = document.getElementById('left').value.split('\n');
        
        function format(expr) { return apl.fmt(expr).join('\n'); }

        // if we're on a new line, add a new div
        if (document.getElementById('right').children.length < lines.length) {
            let missing = lines.length - document.getElementById('right').children.length;
            document.getElementById('right').innerHTML += "<div class='row'></div>".repeat(missing);
        }

        let right = document.getElementById('right').children;

        for (let i=0; i<right.length; i++) {
            if (i<lines.length && !lang.isIgnore(lines[i])) {
                let prog = lines.slice(0, i+1).join('\n')
                let result = format(apl(prog));
                updateLine(i, result);
            }
            else {
                updateLine(i, "");
            }
        }

        // document.getElementById('output').innerHTML = ...;

    }
}