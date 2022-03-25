class Frink extends Lang {

    static commandPrefix = '!';

    static getAddress(localhost) {
        return 'ws://127.0.0.1:8884';
        if (localhost) {
            return 'ws://127.0.0.1:8002';
        }
        return 'ws://54.153.39.161:8884/';

    }

    static init() {
        [
            // "showApproximations[false]",

            // these three were my defaults before parsing frink's output on frontend
            // "rationalAsFloat[true]",
            // "setPrecision[10]",
            // "showDimensionName[false]",

        ].forEach(code => send(ws, {"code": code}));
        // More efficient if .join(";") and send it in one JSON
    }
    

    // static postProcess(disp) {
    //     let out = parseFrinkOutput(disp);

    //     if (!out.matched == true) {
    //         return out.original;
    //     }

    //     // let decimal = out.decimal;
    //     let decimal = Utils.round(out.decimal, 6);
    //     let units = out.units.slice(0,3);
    //     // units = units.map(x => String(x).padStart(3, " "))
    //     units = "(" + units.join(", ") + ")"

    //     return `${decimal} ${units}`;

    // }

    static postProcess(disp) {
        if (disp[0] == '[') {
            let items = disp.slice(1, disp.length-1).split(', ')
            return items.join('\n')
        }
        return pprintFrinkOutput(disp);
    }


    static runCommand(command) {
        if (command[1] == '!') {
            return recursiveGetUnit(command.slice(2)).join('\n');
        }
        return getUnit(command.slice(1));
    }

    // not very smart but better than the alternative
    static whichLines(lines) {
        function range (a,b) { return Array.from({length:b-a},(_,i)=>i+a); }
        function runAll(code) { return code.includes("=!"); }
        function hasAssignment(code) { return code.includes("="); }
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