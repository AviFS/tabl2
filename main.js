let ws;

function init() {
    lines = [];
    ws = new WebSocket('ws://127.0.0.1:8003/');
    ws.onmessage = simple_onmessage;
}

function send(ws, data) {
    data = JSON.stringify({
        line: data.line,
        code: data.code
    })
    ws.send(data);
}


function input() {
    linesUpdate()
    // if we're on a new line, add a new div
    if (document.getElementById('right').children.length < lines.length) {
        document.getElementById('right').innerHTML += "<div class='row'></div>";
    }

    let children = document.getElementById('right').children;
    // send(ws, {reset: true})

    let currentLine = getLineNumber();

    // until we have a better solution
    if (currentLine != 0) { currentLine--; }

    for (let i=currentLine; i<children.length; i++) {
        let code = getLine(i);
        if (code == "" || code[0] == '#') {
            children[i].innerHTML = "";
            continue;
        }
        let data = { line: i, code: code, input: "", reset: false };
        send(ws, {line: i, code: code, input: "", state: []})
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
    clearTimeout(timer);
    let data = JSON.parse(event.data);


    if (!data.isError) {
        updateLine(data.line, data.disp)
    }
    else {
        // updateLine(data.line, "*")
        timer = setTimeout(errorCallback, 1500, data)
    }
}

