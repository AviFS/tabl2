class ngnAPL extends Lang {

    static getAddress(localhost) {
        return false;
    }

    static input(code = true) {
        // let program = document.getElementById('left').value;
        let lines = document.getElementById('left').value.split('\n');
        
        function format(expr) { return apl.fmt(expr).join('\n'); }

        let display = ""
        for (let i=0; i<lines.length; i++) {
            if (!lang.isIgnore(lines[i])) {
                let prog = lines.slice(0, i+1).join('\n')
                display += format(apl(prog))+'\n';
            }
            else {
                display += "\n";
            }
        }

        document.getElementById('right').innerHTML = display;
        // document.getElementById('output').innerHTML = ...;

    }
}