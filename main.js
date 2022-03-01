let ws;

function setLang() {
    let lang = document.getElementById('lang').value;
    console.log(lang)
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

    setLang();

    let out = JSON.stringify({
        line: 1,
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

    _onmessage({data: out});

}


function _onmessage(event) {
    // console.log(event.data)
    let data = JSON.parse(event.data);
    console.log(data)

    // disp
    if (!data.isError) {
        document.getElementById('disp').innerHTML = data.disp;
    }
    else {
        let errorString = "*"
        document.getElementById('disp').innerHTML = errorString;
    }

    // output
    if (data.output) {
        document.getElementById('out').innerHTML = data.output;
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