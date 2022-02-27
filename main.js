let ws = new WebSocket('ws://127.0.0.1:8000/');
ws.send

function run() {
    let text = document.getElementById('text').value;
    ws.send(text);
}

ws.onmessage = function onmessage(event) {
    document.getElementById('result').innerText = event.data;
}
