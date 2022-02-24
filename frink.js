// These websocket bits can be moved to scratch.js
let ws = new WebSocket('ws://127.0.0.1:8000/');
ws.onopen = _onopen;
ws.onmessage = _onmessage;
// End scratch.js

// Frink specific
delimiter = "out: 666666"

function _onopen (event) {
    // ws.send("showApproximations[false]")
    ws.send("rationalAsFloat[true]")

    ws.send("setPrecision[10]")

    ws.send("showDimensionName[false]")
}


function _onmessage(event) {
    if (event.data == delimiter) {
        show(queue[0], response);

        response = {out: "", err: "", log: ""};
        queue.shift();
    } 

    else if (isIgnore(event.data)) {return;}

    else {
        if (event.data.substr(0,5) == "err: ") {
            response.err += event.data.substr(5) + "\n";
        } 
        else if (isLog(event.data)) {
            response.log += event.data.substr(5) + "\n";
        }
        else if (event.data.substr(0,5) == "out: ") {
            response.out += event.data.substr(5) + "\n";
        }
        else {console.log(`-${event.data.substr(0,5)}-`); outputPrefaceError();}
    }
}

function show(lineNum, response) {
    let lineElement = document.getElementById('right').children[queue[0]];
    if (response.log.length != 0) {
        // lineElement.innerHTML = "? ";
        // don't change anything a la numi
        return;
    }
    lineElement.innerHTML = response.out;
}


function isLog(output) {
    return output.includes('error') ||
    output.includes('undefined') ||
    output.includes('cannot') ||
    output.includes('Unrecognized') ||
    output.includes('parse') ||
    output.includes('missing'); // || output.includes('unknown');
}

function isIgnore(output) {
    return `
    out: Frink - Copyright 2000-2022 Alan Eliasen, eliasen@mindspring.com.
    `.includes(output);
}

function isBlank(output) {
    return output.includes('(')
}