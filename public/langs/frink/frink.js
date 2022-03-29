class Frink extends Lang {

    static commandPrefix = '!';

    static mod = false;

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

        if (Frink.mod == true) {
            Frink.mod = false;
            let out = parseFrinkOutput(disp);
            let dimension = out.dimension=="unknown unit type"? '*': out.dimension;
            return dimension;
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


    static input(code=true) {
        let prev = lines;
        linesUpdate()
        let changedLines = diffLines(prev, lines)
    
        if (debug == 0.5 || debug == 1.5) {
            console.log("changedLines:\n", changedLines);
        }
    
        // if we're on a new line, add a new div
        if (document.getElementById('right').children.length < lines.length) {
            let missing = lines.length - document.getElementById('right').children.length;
            document.getElementById('right').innerHTML += "<div class='row'></div>".repeat(missing);
        }
    
        let children = document.getElementById('right').children;
    
        let input = document.getElementById('input').innerText;
    
        // this shouldn't be necessary, for most langs, but just to save a nasty bug down the line
        // without this, if you enter input, but you have no code, nothing runs
        // that's just what we want... except for langs where input alone can create output
        if (code == false && document.getElementById('left').value.trim() == "") {
            send(ws, {line: 0, code: code, input: input});
            return;
        }
    
        // send(ws, {reset: true})
    
        let lineNums = lang.whichLines(changedLines);
        // let lineNums = changedLines;
        if (debug > 0) {
            // console.log(`runningLines\n`, lineNums)
            let running = lineNums.filter(x => !lang.isIgnore(getLine(x)));
            console.log(`running lines:\n`, running);
        }
    
        for (const i of lineNums) {
            let code = getLine(i);
            if (lang.isIgnore(code)) {
                children[i].innerHTML = "";
                continue;
            }
            // if (code[0] == lang.commandPrefix) {
            //     let res = lang.runCommand(code);
            //     children[i].innerHTML = res? res: children[i].innerHTML;
            //     continue;
            // }
            let data = { line: i, code: code, input: input, reset: false, state: [] };

            if (code[0] == '!') {
                if (code[1] == '!') {
                    children[i].innerHTML = recursiveGetUnit(code.slice(2)).join('\n');
                }
                else if (code[1] == '(') {
                    function parseTuple(tuple) {
                        let s = tuple.split(',');
                        for (let i=0; i<3; i++) {
                            if (i > s.length-1) s.push(0)
                            else s[i] = parseInt(s[i])
                        }
                        return s
                    }
                    let [m, kg, s] = parseTuple(code.slice(2))
                    let unitString = `m^${m} kg^${kg} s^${s}`;
                    if (code.trim()[code.trim().length-1] == ")") {
                        data.code = `units[${unitString}]`
                        send(ws, data)
                    }
                    else {
                        Frink.mod = true;
                        data.code = unitString;
                        send(ws, data)
                    }
                }
                else {
                    children[i].innerHTML = getUnit(code.slice(1));
                }
                continue;
            }

            let trimmed = code.trim()
            if (trimmed.slice(-2) == "??") {
                // Frink.mod = true;
                data.code = "units[" + trimmed.slice(0,-2) + "]";
            }
            else if (trimmed[trimmed.length-1] == "?") {
                Frink.mod = true;
                data.code = trimmed.slice(0,-1);
            }
            // can have something a bit more flexible here like this, or even more flexible, but i'll keep the simple prefix command for now:
            /* if (lang.isIntercept(data)) { continue; } */
            send(ws, data)
        }
    }

}