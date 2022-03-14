let ws;
let lang;
let debug = 0;

function updateLine(line, data) {
    // console.log(line, data)
    document.getElementById('right').children[line].innerHTML = data;
}
function getLineNumber() {
    let textarea = document.getElementById('left');
    return textarea.value.substr(0, textarea.selectionStart).split("\n").length-1;
}

function linesUpdate() {
    lines = document.getElementById('left').value.split("\n");
}
function getLine(lineNum) {
    // this is also a dumb function right now, but might be dynamically smart later
    return lineNum < lines.length? lines[lineNum]: "";
}
function dim(line) {
    document.getElementById('right').children[line].classList.add('dim');
}

function setDefaultLang() {
    defaultLang = "apl";
    console.log(`Setting lang to ${defaultLang} by default.`);
    return defaultLang;
}

function init() {
    lines = [];
    // setWebSocket('ws://54.153.39.161:8006/');
    setWebSocket('ws://127.0.0.1:8008');

    let langID = window.location.hash.substring(1);
    let opts = {
        "frink": Frink,
        "apl": APL,
    }
    lang = opts[langID] || opts[setDefaultLang()];

    let localhost = false;
    setWebSocket(lang.getAddress(localhost))
    

    // temp fix; can be removed later
    document.getElementById('right').innerHTML += "<div class='row'></div>";
}


// convenience function to use in browser console
function sendCode(code) {
    send(ws, {"code": code});
}


function setWebSocket(address) {
    ws = new WebSocket(address);
    ws.onopen = function(event) {
        console.log('connected')
        lang.init();
    }
    ws.onclose = function(event) {
        console.log('close')
    }
    ws.onmessage = _onmessage;
}

function send(ws, data) {
    if ( debug > 2 ) {
        console.log("sent:\n", data);
    }

    data = JSON.stringify(lang.formatJSON(data));

    ws.send(data);
}

function diffLines(prev, curr) {
    function range (a,b) { return Array.from({length:b-a},(_,i)=>i+a); }
    return range(0, Math.max(prev.length, curr.length)).filter(function (ind) {
        let prevInd = prev[ind]? prev[ind]: "";
        let currInd = curr[ind]? curr[ind]: "";
        return prevInd != currInd;
    });
}

function input(code=true) {
    let prev = lines;
    linesUpdate()
    let changedLines = diffLines(prev, lines)

    if (debug > 0) {
        console.log("changedLines:\n", changedLines);
    }

    // if we're on a new line, add a new div
    if (document.getElementById('right').children.length < lines.length) {
        document.getElementById('right').innerHTML += "<div class='row'></div>";
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
        console.log(`running lines:\n`, lineNums.filter(x => !lang.isIgnore(getLine(x))));
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


function errorCallback(data) {
    updateLine(data.line, "*");
    console3(data);
}

let timer;

// This is a super hacky wrapper function for 'onmessage' because APL's output JSON is being annoying.
// It works, but it throws tons of JS errors in the console
// This just runs our usual onmessage function, while hiding the errors
// The debug value has to be in the double digits to show the errors, because they're that unhelpful 
// function __onmessage(event) {
//     try { _onmessage(event); }
//     catch (error) {
//         if (debug > 9) {
//             console.log(error);
//         }
//     }
// }

function _onmessage(event) {
    data = JSON.parse(event.data);

    if ( debug > 1 ) {
        console.log("received:\n", data);
    }

    clearTimeout(timer);
    document.getElementById('output').innerText = data.output? data.output: " ";

    // disp
    if (!data.isError) {
        document.getElementById('right').children[data.line].classList.remove('dim');
        updateLine(data.line, data.disp)
    }
    else {
        let errorString = "*"
        // dim(data.line);
        timer = setTimeout(errorCallback, 1000, data)
    }

    // output
    if (data.output) {
        document.getElementById('out').innerHTML += data.output;
    }


}

function setHost({address, port}={}) {
    if (address == undefined) { address = "127.0.0.1"; }
    if (port == undefined) { port = 8008; }
    setWebSocket(`ws://${address}:${port}`);
}

////////////////////////////////
////////   helper  /////////////
///////////////////////////////

// console
function console1(data) {
    if (data.console.log || data.console.warn || data.console.error) {

        // maybe use console.group for all the console things for easier debugging
        console.group(`line ${data.line}: ${data.debug.code}`)

        if (data.console.log) {
            console.log(data.console.log)
        }
        if (data.console.warn) {
            console.warn(data.console.warn)
        }
        if (data.console.error) {
            console.error(data.console.error)
        }
        console.groupEnd(`${data.line}: ${data.debug.code}`)
    }
}

function console2(data) {
    if (data.console.log) {
        console.log(`${data.line}: ${data.console.log}`)
    }
    if (data.console.warn) {
        console.warn(`${data.line}: ${data.console.warn}`)
    }
    if (data.console.error) {
        console.error(`${data.line}: ${data.console.error}`)
    }
}

function console3(data) {
    if (data.console.log) {
        console.log(`${data.line+1}: ${data.console.log}`)
    }
    if (data.console.warn) {
        console.warn(`${data.line+1}: ${data.console.warn}`)
    }
    if (data.console.error) {
        console.error(`${data.line+1}: ${data.console.error}`)
    }
}