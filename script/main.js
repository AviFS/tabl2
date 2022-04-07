let ws;
let lang;
let url;
let opts;
let disp = [];
let lastLine = 0;

let debug = 0;
let localhost = false;
let defaultLang = "ngn-apl";

function toggleSettings() {
    document.getElementById('settings').classList.toggle('hide');
    document.getElementById('tablook').classList.add('hide');
}

function toggleTablook() {
    document.getElementById('tablook').classList.toggle('hide');
    document.getElementById('settings').classList.add('hide');
}

function tablookItemClicked() {
    url = parseURL();
    document.getElementById('left').value = parseTIOLink(url.permalink).code;
    lang.input(true);
    // setLang(url.langID)
    // init();
}

function updateSettings() {
    RunBF.n = document.getElementById('n').value;
    RunBF.padding = document.getElementById('padding').value;

    let endpoints = document.getElementById('dispEndpoints').value

    // for now, until sticky tracking is smarter, selecting sticky requires re-running everything
    switch (endpoints) {
        case 'fixed': RunBF.dispEndpoints = RunBF.dispEndpointsFixed; break;
        case 'sticky': RunBF.dispEndpoints = RunBF.dispEndpointsSticky; lang.input(false); break;
        case 'centered': RunBF.dispEndpoints = RunBF.dispEndpointsCentered; break;
        case 'elastic': RunBF.dispEndpoints = RunBF.dispEndpointsElastic; break;
    }
    lang.updateAllDisp();
}

function changeLang() {
    let langID = document.getElementById('lang-select').value
    url.langID = langID;
    setLang(langID);
    // force re-run all lines
    // necessary for "smart" whichLines() langs like APL and Frink
    // which will only re-run necessary lines, and as a result not change anything

    // alternatively, could delete all input on lang switch and store it in a cookie for that specific lang

}

document.addEventListener("selectionchange", function () {
    let currLine = getLineNumber();
    if (currLine > document.getElementById('right').children.length-1) {
        let missing = currLine - (document.getElementById('right').children.length-1);
        disp.push(...Utilss.fill({type: "Empty"}, missing));
        document.getElementById('right').innerHTML += "<div class='row-wrapper'><div class='row'></div></div>".repeat(missing);
    }
    if (lastLine != currLine) {
        document.getElementById('right').children[lastLine].firstElementChild.classList.remove('curr-line');
        document.getElementById('right').children[currLine].firstElementChild.classList.add('curr-line');

        // May want multiple multilines in the future
        // So the z-index is set dynamically for each row to give precedence to later outputs in case of overlap
        document.getElementById('right').children[lastLine].firstElementChild.classList.remove('multiline');
        document.getElementById('right').children[currLine].firstElementChild.classList.add('multiline');
        document.getElementById('right').children[lastLine].firstElementChild.style["z-index"] = 0;
        document.getElementById('right').children[currLine].firstElementChild.style["z-index"] = currLine+1;

        lang.updateDisp(lastLine);
        lang.updateDisp(currLine);
        lastLine = currLine;
    }

    // temp hacky fix to get rid of empty values in array where there are blank lines
    // occurs when copying/pasting (multiline input) text containing blank lines (or isIgnore lines) while
    // using a runner that doesn't run blank lines so that those lines are neither initializied nor evaluated
    disp = Utilss.range(0,disp.length).map(i=>disp[i]==undefined? {type: "Empty"}: disp[i]);

})

function updateLine(line, data) {
    // console.log(line, data)
    document.getElementById('right').children[line].firstElementChild.innerHTML = data;
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
    document.getElementById('right').children[line].firstElementChild.classList.add('dim');
}

function logSetDefaultLang() {
    console.log(`Setting lang to ${defaultLang} by default.`);
    return defaultLang;
}

function initialRun() {
    lang.init();
    lang.input(true);
}

function setLang(langID) {
    opts = {
        "frink": Frink,
        "apl": APL,
        "bf": Brainfuck,
        "pip": Pip,
        "ngn-apl": ngnAPL,
        "joy": Joy,
    }

    if (!opts.hasOwnProperty(langID)) {langID = logSetDefaultLang(); }
    lang = opts[langID];
    document.getElementById('lang-select').value = langID;


    document.getElementById('input').addEventListener('input', x => lang.input(code=false));
    document.getElementById('left').addEventListener('input', x => lang.input(code=true));

    if (lang.getAddress(localhost) != false) {
        setWebSocket(lang.getAddress(localhost))
    }
    else {
        initialRun();
    }
}

function init() {

    document.getElementById('tablook').innerHTML = Tablook.json2html(Tablook.tablook.frink);

    // Focus input element on load
    document.getElementById('left').focus();

    lines = [];
    // setWebSocket('ws://54.153.39.161:8006/');
    // setWebSocket('ws://127.0.0.1:8008');

    // temp fix; can be removed later
    document.getElementById('right').innerHTML += "<div class='row-wrapper'><div class='row'></div></div>";
    disp.push({type: "Empty"})

    url = parseURL();
    document.getElementById('left').value = parseTIOLink(url.permalink).code;
    setLang(url.langID)
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
        document.getElementById('right').children[data.line].firstElementChild.classList.remove('dim');
        disp[data.line] = {type: "Static", text: data.disp};
        lang.updateDisp(data.line);
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