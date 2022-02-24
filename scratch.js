let lines = [];
let queue = [];
let streams = {stdout: "", stderr: ""};
let firstLine = true;

let lastRunLine = "";

let ws = new WebSocket('ws://127.0.0.1:8000/');
ws.onopen = _onopen;
ws.onmessage = _onmessage;


function init() {
    document.addEventListener("keydown", (e) => {
        if (e.key === 'e' && e.metaKey) {
            console.log("line: " + getLineNumber());
        }
    });

}

function linesUpdate() {
    // brute force right now
    // make it update `lines` array dynamically and more cleverly
    lines = document.getElementById('left').value.split("\n");
}

function getLine(lineNum) {
    // this is also a dumb function right now, but might be dynamically smart later
    return lineNum < lines.length? lines[lineNum]: "";
}

function getLineNumber() {
    let textarea = document.getElementById('left');
    return textarea.value.substr(0, textarea.selectionStart).split("\n").length-1;
}


function input() {
    linesUpdate();
    let lineNum = getLineNumber();

    // there should be a smarter way to do this so we don't always have to run the previous line
    // but for now, if they hit return in the middle of line 5, it'll register the linenumber of the edit
    // as line 6, because that's where the cursor now is. a hacky way around this is just to always run the line above jsut in case
    if (lineNum != 0) {
        lineNum--;
    }
    // end hack

    // if we're on a new line, add a new div
    if (document.getElementById('right').children.length < lines.length) {
        document.getElementById('right').innerHTML += "<div class='row'></div>";
    }

    // safety check
    console.assert(lineNum < document.getElementById('right').children.length)

    let children = document.getElementById('right').children;
    for (let i=lineNum; i<children.length; i++) {
        let line = getLine(i);
        if (line == "") {
            children[i].innerHTML = "";
        }
        else {
            // children[i].innerHTML = run(line);
            ws.send(line);
        }
        ws.send('666666')
        // TODO: this should really push a pair queue.push((lineNum, lineContent))
        queue.push(i);
    }
    // console.log("input: ", queue);
}

function outputPrefaceError() {
    console.error("This shouldn't happen. It should either be prefaced with 'out: ' or 'err: '.")
}

function _onopen (event) {
    for (const cmd of cmds) {
        ws.send(cmd);
    }
}

function _onmessage(event) {
    if (event.data == delimiter) {
        show(queue[0], streams);
        streams = {stdout: "", stderr: ""};
        queue.shift();
        return;
    } 
    console.log(event.data.substr(0,5) == "out: ")
    switch (event.data.substr(0,5)) {
        case "err: ":
            streams.stderr += event.data.substr(5) + "\n";
            break;
        case "out: ":
            streams.stdout += event.data.substr(5) + "\n";
            break;
        default:
            outputPrefaceError();
    }
}
