class APL extends Lang {
    static f() {
        return 324;
    }

    static foo() {
        return 2;
    }

    static getAddress(localhost) {
        if (localhost) {
            return 'ws://127.0.0.1:8008';
        }
        return 'ws://54.153.39.161:8006/';
    }


    // it's still not very smart, but a huge improvement
    static whichLines(line) {
        function range (a,b) { return Array.from({length:b-a},(_,i)=>i+a); }
        function runAll(code) { return code.includes("←←"); }
        function hasAssignment(code) { return code.includes("←") || code.includes("⎕EX"); }
        // That second check is just for Adám. Did I get that right?
    
        let children = document.getElementById('right').children;
        let code = getLine(line);
    
        return range(0, children.length);
    
        if (runAll(code)) {
            return range(0, children.length);
        }
        if (hasAssignment(code)) {
            let before = range(0, line).filter(function(i) {
                return hasAssignment(getLine(i));
            });
            let after = range(line+1, children.length);
            return [].concat(before, [line], after);
        }
        return [line];

    }

}