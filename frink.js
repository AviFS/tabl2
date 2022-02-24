// These websocket bits can be moved to scratch.js
let ws = new WebSocket('ws://127.0.0.1:8000/');
ws.onopen = _onopen;
ws.onmessage = _onmessage;
// End scratch.js

// Frink specific
delimiter = "out: 666666"

function _onopen (event) {
    ws.send("showApproximations[false]")
    ws.send("setPrecision[4]")
}


function _onmessage(event) {
    if (event.data == delimiter) {
        let children = document.getElementById('right').children;
        children[queue[0]].innerHTML = show(queue[0], response);

        response = {out: "", err: ""};
        queue.shift();
    } 

    else if (isIgnore(event.data)) {return;}

    else {
        if (event.data.substr(0,5) == "err: " || isError(event.data)) {
            response.err += event.data.substr(5) + "\n";
        } 
        else if (event.data.substr(0,5) == "out: ") {
            response.out += event.data.substr(5) + "\n";
        }
        else {console.log(`-${event.data.substr(0,5)}-`); outputPrefaceError();}
    }
}

function show(lineNum, response) {
    return response.out;
}


function isError(output) {
    return output.includes('error') || output.includes('undefined'); // || output.includes('unknown');
}

function isIgnore(output) {
    return false;
    return `
    out: Frink - Copyright 2000-2022 Alan Eliasen, eliasen@mindspring.com.
    `.includes(output);
}

function isBlank(output) {
    return output.includes('(')
}