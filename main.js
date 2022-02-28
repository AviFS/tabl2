let ws;

function setLang() {
    let lang = document.getElementById('lang').value;
    console.log(lang)
    // lang = 'cat';
    ws = new WebSocket('ws://54.153.39.161:8000/'+lang);
    // ws = new WebSocket('ws://127.0.0.1:8001/'+lang);
    // ws = new WebSocket('ws://localhost:8000/cat');

    ws.onmessage = function(event) {
        console.log(event.data)
        document.getElementById('result').innerText = event.data;
    }
}


function run() {
    let text = document.getElementById('text').value;
    ws.send(text);
}
