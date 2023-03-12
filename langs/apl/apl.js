class APL extends Lang {

    static name = "APL";

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
        return 'ws://167.71.240.216:8006/';
    }


    // it's still not very smart, but a huge improvement
    static whichLines(lines) {
        function range (a,b) { return Array.from({length:b-a},(_,i)=>i+a); }
        function runAll(code) { return code.includes("←←"); }
        function hasAssignment(code) { return code.includes("←") || code.includes("⎕EX"); }
        // That second check is just for Adám. Did I get that right?
    
        let children = document.getElementById('right').children;
    
        let accLines = [];
        for (let i=0; i<lines.length; i++) {
            let line = lines[i];
            let code = getLine(line);
            if (runAll(code)) {
                // return lines;
                return range(0, children.length);
            }
            if (hasAssignment(code)) {
                let before = range(0, line).filter(function(i) {
                    return hasAssignment(getLine(i));
                });

                // Both are equivalent. I have to figure out which is easier to read/understand
                // accLines means I can do `for (const line of lines)` whereas slice means I can get rid of the accumulator/pushing
                let otherLines;
                otherLines = lines.slice(0, i);
                otherLines = accLines;

                let after = range(line, children.length);
                return [].concat(before, otherLines, after);
            }
            accLines.push(line);
        }
        return lines;
    }

}