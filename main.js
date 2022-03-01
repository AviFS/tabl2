let ws;

// function setInterp() {}

function setLang() {
    // let lang = document.getElementById('lang').value;
    // console.log(lang)
    let lang = "vyxal"
    // lang = 'cat';
    // ws = new WebSocket('ws://54.153.39.161:8000/'+lang);
    // ws = new WebSocket('ws://127.0.0.1:8001/'+lang);
    // ws = new WebSocket('ws://localhost:8000/cat');
    ws = new WebSocket('ws://127.0.0.1:8002/');

    ws.onmessage = _onmessage;
}


function run() {
    let text = document.getElementById('text').value;
    let line = "000";
    ws.send(line + ": " + text);
}

function init() {

    lines = [];
    setLang();

    let out = JSON.stringify({
        line: 0,
        disp: "1 3",
        output: "7",
        isError: true,
        console: {
            log: "",
            warn: "",
            error: "",
        },
        debug: {
            code: "1 3 4+,"
        }
    });

    // _onmessage({data: out});

}

function send(ws, data) {
    data = JSON.stringify({
        line: data.hasOwnProperty('line')? data.line: 0,
        code: data.hasOwnProperty('code')? data.code: "",
        input: data.hasOwnProperty('input')? data.input: "",
        reset: data.hasOwnProperty('reset')? data.reset: false,
        state: data.hasOwnProperty('state')? data.state: [],
    })
    ws.send(data);
    console.log(data);
}


function input() {
    linesUpdate()
    // if we're on a new line, add a new div
    if (document.getElementById('right').children.length < lines.length) {
        document.getElementById('right').innerHTML += "<div class='row'></div>";
    }

    let children = document.getElementById('right').children;
    send(ws, {reset: true})
    for (let i=0; i<children.length; i++) {
        let code = getLine(i);
        if (code == "" || code[0] == '#') {
            children[i].innerHTML = "";
            continue;
        }
        let data = { line: i, code: code, input: "", reset: false };
        send(ws, {line: i, code: code, input: "", state: []})
    }
    // console.log("in: ",queue)
    // console.log("input: ", queue);
}
    // ws.send('000: '+document.getElementById('left').innerText)

function _onmessage(event) {
    // console.log(event.data)
    let data = JSON.parse(event.data);
    // console.log(data)

    // disp
    if (!data.isError) {
        // document.getElementById('disp').innerHTML = data.disp;
        updateLine(data.line, data.disp)
    }
    else {
        let errorString = "*"
        updateLine(data.line, data.disp)
    }

    // output
    if (data.output) {
        document.getElementById('out').innerHTML += data.output;
    }

    // console
    console1(data);

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

function console2() {
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