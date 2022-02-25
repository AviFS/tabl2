import { WebSocketServer, WebSocket } from 'ws';

let front = new WebSocketServer({ port: 8001 });
let run = new WebSocket('ws://127.0.0.1:8000/');

let delimiter_in = "?"
let delimiter_out = "out: 666666"

let response = {stdout: "", stderr: ""}

let globals = {};

front.on('connection', function connection(ws) {
  globals.ws = ws;
//   ws.send('out: Connected');

  ws.on('message', async function message(msg) {
    // added the aync sleep because i was still every now and then getting the err in the next one
    // was something getting this:
    // ?
    // {"out":"","err":""}
    // 2
    // {"out":"2\n","err":"(standard_in) 41: illegal character: ?\n"}

    // instead of always getting this:
    // ?
    // {"out":"","err":"(standard_in) 41: illegal character: ?\n"}
    // 2
    // {"out":"2\n","err":"""}

    // ws.send('!'+data);
    // console.log(String(msg))
    run.send(msg);
    await new Promise(resolve => setTimeout(resolve, 100));
    run.send(delimiter_in)
  });
});

front.on('close', function close() {
    console.log('disconnected');
});

run.on('message', function message(data) {
    let event = {"data": String(data)};
    // console.log(event.data)
        if (event.data.includes('parse')) {
        // if (event.data == delimiter_out) {
            console.log('---')
            // console.log(response)
        globals.ws.send(JSON.stringify(response));

        response = {stdout: "", stderr: ""};
        return;
    } 
    else {
        console.log(event.data);
    }
    // else {console.log(1)}

    switch (event.data.substring(0,5)) {
        case "err: ":
            response.stderr += event.data.substring(5) + "\n";
            break;
        case "out: ":
            response.stdout += event.data.substring(5) + "\n";
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
