class Lang {

    static getAddress(localhost) {
        console.error("getAddress() must be overwritten.")
    }
    
    static foo() {
        return 9991;
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
            let data = { line: i, code: code, input: input, reset: false, state: [] };
            send(ws, data)
        }
    }
}