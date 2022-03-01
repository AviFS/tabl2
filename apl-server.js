import { WebSocketServer, WebSocket } from 'ws';

let front = new WebSocketServer({ port: 8003 });
let run = new WebSocket('ws://127.0.0.1:8000/');

let delimiter_in = "666666"
let delimiter_out = "out: 666666"

let response = {disp: ""};

let globals = {};

front.on('connection', function connection(ws) {
  globals.ws = ws;
//   ws.send('out: Connected');

  ws.on('message', async function message(msg) {
    let data;
    try {
        data = JSON.parse(msg);
    }
    catch {
        // data = {line: 0, code: ""}
        return;
    }
    console.log("in: "+data.code)
    // run.send(`⎕←'line: ${data.line}'\n${data.code}\n⎕←'end'`);
    run.send(`${data.line}⋄${data.code}\n'`);
    // run.send(`⎕←23⋄⎕←1⋄⎕←⋄data.code\n'`);
    run.send(delimiter_in)
    // await new Promise(resolve => setTimeout(resolve, 10));
  });
});

front.on('close', function close() {
    console.log('disconnected');
});

let num = 666 
run.on('message', function message(data) {
    let event = {"data": String(data)};
    if (event.data == delimiter_out) {
        num = 666
        console.log('---')
        // console.log(response)
        // response.disp = response.disp.substring(0, response.disp.length-1)
        let lines = response.disp.split('\n');
        let line = parseInt(lines[0]);
        let disp = lines.slice(1,-1).join('\n');
        globals.ws.send(JSON.stringify({line: line, disp: disp}));

        response = {disp: ""};
        return;
    } 

    else {
    }


    switch (event.data.substring(0,5)) {
        case "err: ":
            break;
        case "out: ":
            response.disp += event.data.substring(5) + "\n";
            break;
        default:
            outputPrefaceError();
    }
});

// run.on('message', function message(msg) {
//     switch (msg.substr(0,5)) {
//         case "out: ":
//             data.out += msg.substr(5);
//             break;
//         case "err: ":
//             data.err += msg.substr(5);
//             break;
//     }
// })
