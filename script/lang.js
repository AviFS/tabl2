class Lang {

    static commandPrefix = undefined;
    static getAddress(localhost) {
        console.error("getAddress() must be overwritten.")
    }
    
    static foo() {
        return 9991;
    }

    static updateDisp(line) {
        //  this happens whenever you leave an empty line on a "smart" runner
        // the element disp[n] in the disp array is only defined when line n is run
        // so if lang.whichLines/lang.isIgnore is set up to not run empty lines
        // then the corresponding disp will be undefined until you type something on that line to make it get run
        if (disp[line] == undefined) {
            updateLine(line, "");
            return;
        }

        // if current line, show full thing
        if (getLineNumber() == line) {
            updateLine(line, disp[line]);
            return;
        }

        // if not current line, show one-line version
        updateLine(line, disp[line].split('\n').join(', '));
    }

    static isIgnore(code) {
        return code.trim() == "" || code[0] == '#';
    }

    static whichLines(lines) {
        // return lines;
        function range (a,b) { return Array.from({length:b-a},(_,i)=>i+a); }
        let children = document.getElementById('right').children;
        return range(0, children.length);
    }

    static init() {
        // Empty by default
    }

    static formatJSON(data) {
        return {
            line: data.hasOwnProperty('line')? data.line: 0,
            code: data.hasOwnProperty('code')? data.code: "",
            input: data.hasOwnProperty('input')? data.input: "",
            reset: data.hasOwnProperty('reset')? data.reset: false,
            state: data.hasOwnProperty('state')? data.state: [],
        };
    }

    // by default this is the identity
    // all current backends send back ".disp" exactly as it should be displayed
    // that was the whole original idea! but no more.
    static postProcess(disp) {
        return disp;
    }


    static input(code=true) {
        let prev = lines;
        linesUpdate()
        let changedLines = diffLines(prev, lines)
    
        if (debug == 0.5 || debug == 1.5) {
            console.log("changedLines:\n", changedLines);
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
                disp[i] = "";
                lang.updateDisp(i);
                continue;
            }
            if (code[0] == lang.commandPrefix) {
                let res = lang.runCommand(code);
                disp[i] = res? res: disp[i];
                lang.updateDisp(i);
                continue;
            }
            let data = { line: i, code: code, input: input, reset: false, state: [] };
            // can have something a bit more flexible here like this, or even more flexible, but i'll keep the simple prefix command for now:
            /* if (lang.isIntercept(data)) { continue; } */
            send(ws, data)
        }
    }
}