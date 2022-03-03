let ws;

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
    ws.onmessage = simple_onmessage;
}

function send(ws, data) {
    data = JSON.stringify({
        line: data.hasOwnProperty('line')? data.line: 0,
        code: data.hasOwnProperty('code')? data.code: "",
        input: data.hasOwnProperty('input')? data.input: "",
        reset: data.hasOwnProperty('reset')? data.reset: false,
        state: data.hasOwnProperty('state')? data.state: [],
    })
    console.log(data)

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
    // updateLine(data.line, "?");
    if (data.err) {
        console.warn(`${data.line}: ${data.err}`);
    }
}

let timer;
function simple_onmessage(event) {
    let data = JSON.parse(event.data);
    console.log(data)

    clearTimeout(timer);

    document.getElementById('output').innerText = data.output? data.output: " ";

    if (!data.isError) {
        document.getElementById('right').children[data.line].classList.remove('dim');
        updateLine(data.line, data.disp)
    }
    else {
        // updateLine(data.line, "*")
        dim(data.line);
        timer = setTimeout(errorCallback, 1000, data)
    }
}

