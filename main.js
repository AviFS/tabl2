let ws;
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

function init() {
    lines = [];
    // ws = new WebSocket('ws://54.153.39.161:8004/');
    ws = new WebSocket('ws://127.0.0.1:8004');
    ws.onopen = function(event) {
        console.log('connected')
    }
    ws.onclose = function(event) {
        console.log('close')
    }
    ws.onmessage = _onmessage;
}

function send(ws, data) {
    if ( debug > 1 ) {
        console.log("sent:\n", data);
    }

    data = JSON.stringify({
        line: data.hasOwnProperty('line')? data.line: 0,
        code: data.hasOwnProperty('code')? data.code: "",
        input: data.hasOwnProperty('input')? data.input: "",
        reset: data.hasOwnProperty('reset')? data.reset: false,
        state: data.hasOwnProperty('state')? data.state: [],
    })

    ws.send(data);
}


function input(code=true) {
    linesUpdate()
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

    send(ws, {reset: true})

    let currentLine = getLineNumber();

    // until we have a better solution
    if (currentLine != 0) { currentLine--; }

    for (let i=0; i<children.length; i++) {
        let code = getLine(i);
        if (code == "" || code[0] == '#') {
            children[i].innerHTML = "";
            continue;
        }
        let data = { line: i, code: code, input: input, reset: false, state: [] };
        send(ws, data)
    }
}


function errorCallback(data) {
    updateLine(data.line, "*");
    console2(data);
}

let timer;
function _onmessage(event) {
    let data = JSON.parse(event.data);

    if ( debug > 0 ) {
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
        dim(data.line);
        updateLine(data.line, data.disp)
        timer = setTimeout(errorCallback, 1000, data)
    }

    // output
    if (data.output) {
        document.getElementById('out').innerHTML += data.output;
    }


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

