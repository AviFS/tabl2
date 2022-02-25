import { WebSocketServer, WebSocket } from 'ws';

let front = new WebSocketServer({ port: 8001 });
let run = new WebSocket('ws://127.0.0.1:8000/');

let delimiter_in = "666666"
let delimiter_out = "out: 666666"

let response = {out: "", err: ""}

front.on('connection', function connection(ws) {
  ws.send('Connected');

  ws.on('message', function message(msg) {
    // ws.send('!'+data);
    run.send(msg);
    run.send(delimiter_in)
  });

run.on('message', function message(data) {
    let event = {"data": String(data)};
        if (event.data == delimiter_out) {
            console.log(response)
        ws.send(JSON.stringify(response));
        response = {out: "", err: ""};
        return;
    } 
    // else {console.log(1)}

    switch (event.data.substring(0,5)) {
        case "err: ":
            response.err += event.data.substring(5) + "\n";
            break;
        case "out: ":
            response.out += event.data.substring(5) + "\n";
            break;
        default:
            outputPrefaceError();
    }
});
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
