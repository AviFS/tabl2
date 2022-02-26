let lines = [];
let queue = [];
let response = {stdout: "", stderr: ""};
let firstLine = true;

let lastRunLine = "";

let lang = Cat;
// let lang = Vyxal;
let show = {
    patient: true,
    errorString: "*"
}


let ws = new WebSocket('ws://127.0.0.1:8001/');
ws.onopen = _onopen;
ws.onmessage = _onmessage;

function init() {
    document.addEventListener("keydown", (e) => {
        if (e.key === 'e' && e.metaKey) {
            console.log("line: " + getLineNumber());
        }
    });

    testWebSocket();

}