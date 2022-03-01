import { WebSocketServer, WebSocket } from 'ws';

let front = new WebSocketServer({ port: 8003 });
let run = new WebSocket('ws://127.0.0.1:8000/');

let delimiter_in = "666666"
let delimiter_out = "out: 666666"

let response = {disp: ""};

let globals = {};

front.on('connection', function connection(ws) {
  globals.ws = ws;
  ws.on('message', async function message(msg) {
    let data;
    try {
        data = JSON.parse(msg);
    }
    catch {
        data = {line: 0, code: ""}
    }
    run.send(`${data.line}⋄${data.code}\n`);
    run.send(delimiter_in)
  });
});

let num = 0
run.on('message', function message(data) {
    let event = {"data": String(data)};
    // console.log(event.data)
    if (event.data == delimiter_out) {
        num = 0
        let lines = response.disp.split('\n');
        let line = parseInt(lines[0]);
        let disp = lines.slice(1,-1).join('\n');

        let err = pprintError(line, response.err);
        if (err) {
            response.isError = true;
        }
        globals.ws.send(JSON.stringify({line: line, disp: disp, err: err, isError: response.isError}));

        response = {line: 666, disp: "", err: "", isError: false};
        return;
    } 

    switch (event.data.substring(0,5)) {
        case "err: ":
            response.err += event.data.substring(5) + "\n";
            break;
        case "out: ":
            response.disp += event.data.substring(5) + "\n";
            break;
        default:
            outputPrefaceError();
    }
});

function pprintError(line, error) {
    if (error.includes("Dyalog") || error.includes("dyalog")) { return ""; }
    let acc = []
    let lines = error.split('\n');
    for (let i = 0; i < lines.length; i++) {
        let trimmed = lines[i].trim()
        if (trimmed == "666666" || trimmed == "" || trimmed.includes('⋄')) {
        }
        else if (trimmed == "∧") {
            // let index = lines[i].indexOf('∧')-10;
            // acc.push("index: "+index)
        }
        else {
            acc.push(lines[i]);
        }
    }
    return acc.join('\n');
}