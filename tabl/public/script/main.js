let ws;
let lang;
let url;
let opts;

let debug = 0;
let localhost = false;
let defaultLang = "frink";

function updateLine(line, data) {
    // console.log(line, data)
    document.getElementById('right').children[line].innerHTML = data;
}
function getLineNumber() {
    let textarea = document.getElementById('left');
    return textarea.value.substr(0, textarea.selectionStart).split("\n").length-1;
}

function linesUpdate() {
    lines = document.getElementById('left').value.split("\n");
}
function getLine(lineNum) {
    // this is also a dumb function right now, but might be dynamically smart later
    return lineNum < lines.length? lines[lineNum]: "";
}
function dim(line) {
    document.getElementById('right').children[line].classList.add('dim');
}

function setDefaultLang() {
    console.log(`Setting lang to ${defaultLang} by default.`);
    return defaultLang;
}

function initialRun() {
    lang.init();
    lang.input(true);
}

function init() {

    // Focus input element on load
    document.getElementById('left').focus();

    lines = [];
    // setWebSocket('ws://54.153.39.161:8006/');
    // setWebSocket('ws://127.0.0.1:8008');

    url = parseURL();
    opts = {
        "frink": Frink,
        "apl": APL,
        "bf": Brainfuck,
        "pip": Pip,
        "ngn-apl": ngnAPL,
    }
    if (!opts.hasOwnProperty(url.langID)) { url.langID = setDefaultLang(); }
    lang = opts[url.langID];

    // temp fix; can be removed later
    document.getElementById('right').innerHTML += "<div class='row'></div>";

    document.getElementById('left').value = parseTIOLink(url.permalink).code;

    document.getElementById('input').addEventListener('input', x => lang.input(code=false));
    document.getElementById('left').addEventListener('input', x => lang.input(code=true));

    if (lang.getAddress(localhost) != false) {
        setWebSocket(lang.getAddress(localhost))
    }
    else {
        initialRun();
    }
}

function generatePermalink() {

    
    // this trimming will be a nasty bug if i add an esolang lang like whitespace
    if (document.getElementById('left').value.trim() == "") {
        window.location.href = `#${url.langID}`;
    }
    else {
        let permalink = TIO.makeLink("qqq", "", document.getElementById('left').value).substring(18);
        window.location.href = `#${url.langID}##${permalink}`;
    }
}

function parseTIOLink(link) {
    try {
        return TIO.parseLink(url.permalink);
    }
    catch {
        return {"languageId":"","header":"","code":"","footer":"","input":"","args":[],"options":[]}
    }
}

function parseURL() {
    let hash = window.location.hash.substring(1);
    if (hash[0] == '#') {
        return {"langID": "", "permalink": hash.substring(1)};
    }
    if (hash.includes('##')) {
        let i = hash.indexOf('##');
        return {"langID": hash.substring(0,i), "permalink": hash.substring(i+2)};
    }
    return {"langID": hash, "permalink": ""};
}

// convenience function to use in browser console
function sendCode(code) {
    send(ws, {"code": code});
}


function setWebSocket(address) {
    ws = new WebSocket(address);
    ws.onopen = function(event) {
        console.log('connected')
        initialRun();
    }
    ws.onclose = function(event) {
        console.log('close')
    }
    ws.onmessage = _onmessage;
}

function send(ws, data) {
    if ( debug > 2 ) {
        console.log("sent:\n", data);
    }

    data = JSON.stringify(lang.formatJSON(data));

    ws.send(data);
}

function diffLines(prev, curr) {
    function range (a,b) { return Array.from({length:b-a},(_,i)=>i+a); }
    return range(0, Math.max(prev.length, curr.length)).filter(function (ind) {
        let prevInd = prev[ind]? prev[ind]: "";
        let currInd = curr[ind]? curr[ind]: "";
        return prevInd != currInd;
    });
}




function errorCallback(data) {
    updateLine(data.line, "*");
    console3(data);
}

let timer;

// This is a super hacky wrapper function for 'onmessage' because APL's output JSON is being annoying.
// It works, but it throws tons of JS errors in the console
// This just runs our usual onmessage function, while hiding the errors
// The debug value has to be in the double digits to show the errors, because they're that unhelpful 
// function __onmessage(event) {
//     try { _onmessage(event); }
//     catch (error) {
//         if (debug > 9) {
//             console.log(error);
//         }
//     }
// }

function _onmessage(event) {
    data = JSON.parse(event.data);

    if ( debug > 1 ) {
        console.log("received:\n", data);
    }

    clearTimeout(timer);
    document.getElementById('output').innerText = data.output? data.output: " ";

    // disp
    if (!data.isError) {
        document.getElementById('right').children[data.line].classList.remove('dim');
        updateLine(data.line, lang.postProcess(data.disp));
    }
    else {
        let errorString = "*"
        // dim(data.line);
        timer = setTimeout(errorCallback, 1000, data)
    }

    // output
    if (data.output) {
        document.getElementById('out').innerHTML += data.output;
    }


}

function setHost({address, port}={}) {
    if (address == undefined) { address = "127.0.0.1"; }
    if (port == undefined) { port = 8008; }
    setWebSocket(`ws://${address}:${port}`);
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

function console2(data) {
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

function console3(data) {
    if (data.console.log) {
        console.log(`${data.line+1}: ${data.console.log}`)
    }
    if (data.console.warn) {
        console.warn(`${data.line+1}: ${data.console.warn}`)
    }
    if (data.console.error) {
        console.error(`${data.line+1}: ${data.console.error}`)
    }
}