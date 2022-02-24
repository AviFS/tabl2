let lang = "apl";

let lines = [];
let queue = [];
response = {out: "", err: ""};
let firstLine = true;
let ws = new WebSocket('ws://127.0.0.1:8000/');

let lastRunLine = "";

//TODO: on open:
// showApproximations[false]
// setPrecision[4]
// search [true] on frink page for other parameters
// also there's setPrecision[4], by default it's 20

// TODO:  On resize, adjust right side accordingly. Right now, the left side wraps nicely, but the right side doesn’t adjust. Model this behavior after Numi’s.

// TODO: If you type a unit followed by '?', then you get the definition on the right, as defined in units.txt
// eg:
// magnum?    =>   3/2 liter
function init() {
    // focus left side of textarea onload
    // document.getElementById('left').focus();

    document.addEventListener("keydown", (e) => {
        if (e.key === 'e' && e.metaKey) {
            console.log("line: " + getLineNumber());
        }
    });
}

function linesUpdate() {
    // brute force right now
    // make it update `lines` array dynamically and more cleverly
    lines = document.getElementById('left').value.split("\n");
}

function getLine(lineNum) {
    // this is also a dumb function right now, but might be dynamically smart later
    return lineNum < lines.length? lines[lineNum]: "";
}

function getLineNumber() {
    let textarea = document.getElementById('left');
    return textarea.value.substr(0, textarea.selectionStart).split("\n").length-1;
}


ws.onopen = function(event) {
    if (lang == 'frink') {
        queue.push(0);
        queue.push(0);
        ws.send("showApproximations[false]")
        ws.send("setPrecision[4]")
    }
}

function input() {
    linesUpdate();
    let lineNum = getLineNumber();

    // there should be a smarter way to do this so we don't always have to run the previous line
    // but for now, if they hit return in the middle of line 5, it'll register the linenumber of the edit
    // as line 6, because that's where the cursor now is. a hacky way around this is just to always run the line above jsut in case
    if (lineNum != 0) {
        lineNum--;
    }
    // end hack

    // if we're on a new line, add a new div
    if (document.getElementById('right').children.length < lines.length) {
        document.getElementById('right').innerHTML += "<div class='row'></div>";
    }

    // safety check
    console.assert(lineNum < document.getElementById('right').children.length)

    let children = document.getElementById('right').children;
    for (let i=lineNum; i<children.length; i++) {
        let line = getLine(i);
        if (line == "") {
            children[i].innerHTML = "";
        }
        else {
            // children[i].innerHTML = run(line);
            ws.send(line);
        }
        ws.send('666666')
        // TODO: this should really push a pair queue.push((lineNum, lineContent))
        queue.push(i);
    }
    // console.log("input: ", queue);
}

function run(inp) {
    return inp.split('').reverse().join('');
    // return inp;
}


function delimiter() {
    switch (lang) {
        case 'apl': return "out: 666666"
        case 'frink': return "out: 666666"
        default: console.error(lang);
    }
}

// function isAplEcho(data) {
//     if (queue.length == 0) { console.log(11); return true; }

//     let line = lines[queue[0]];
//     console.log(22, queue)
//     let processed = line == ""? "": `err: ${line.trim()}`; // the .trim() is NEEDED to match APL's trimming when it echoes input to stderr session
//     // Dyalog may also do other postprocessing before echoing and that MUST be added here or there'll be nasty bugs
//     // TODO: add warnings/check/testing that we're matching the echoes precisely
//     return data == processed || 
//     data == "err: 666666";
// }

// function isAplEcho(data) {
//     // if (data == "err: 666666") { return false; }
//     // console.log(lines[queue[0]])
//     if (data.substr(0,5) == "err: ") {
//         if (data.substr(5) == "666666") {
//             return true;
//         }
//         if (queue.length > 0) {
//             console.log("exp: ", lines[queue[0]].trim())
//             console.log("act: ", data.substr(5))

//             if (data.substr(5) == lines[queue[0]].trim()) {
//                 return true;
//             }

//             // had to add this extra check because of inconsistent out/err order
//             if (queue.length > 1) {
//                 if (data.substr(5) == lines[queue[1]].trim()) {
//                     return true;
//                 }
//             }
//         }
//     }
//     return false;
// }

function isAplEcho(data) {
    // if (data.substr(0,5) == "err: ") {
    //     return true;
    // }
    // return false;
    return isFirstError(data);
}
function isIgnore(data) {
    // let lines = document.getElementById('left').inn.split('\n');
    // console.log(`AAAA err: ${lines[queue[0]]}`);
    return `
    err: mkdir: /.dyalog: Read-only file system 
    err: /Applications/Dyalog-18.0.app/Contents/Resources/Dyalog/mapl: line 66: /.dyalog/dyalog.180U64.dcfg: No such file or directory 
    err: /Applications/Dyalog-18.0.app/Contents/Resources/Dyalog/mapl: line 66: /.dyalog/dyalog.dcfg: No such file or directory 
    err: /Applications/Dyalog-18.0.app/Contents/Resources/Dyalog/mapl: line 80: /.dyalog/SALT.180U64.settings: No such file or directory 
    `.includes(data) || 
    isAplEcho(data);

}

function isFirstError(data) {
    return firstLine && data.substr(0,5)=="err: ";
}
ws.onmessage = function(event) {
    // console.log(queue);


    if (event.data == "err: 666666") {
        firstLine = true;
    }
    console.log("_" + (isFirstError(event.data)? 1:0) + "_ " + event.data)

    if (event.data.substr(0,5) == "err: " && event.data != "err: 666666") {
        firstLine = false;
    }


    if (event.data == delimiter(lang)) {
        let children = document.getElementById('right').children;
        children[queue[0]].innerHTML = show(queue[0], response);

        response = {out: "", err: ""};
        queue.shift();
    } 
    else if (isIgnore(event.data)) {return;}
    else {
        // if (firstLine == true) {
        //     // do nothing; throw it out-- this is apl-specific
        //     firstLine = false;
        // }
        if (event.data.substr(0,5) == "err: " || isError(event.data)) {
            response.err += event.data.substr(5) + "\n";
        } 
        else if (event.data.substr(0,5) == "out: ") {
            response.out += event.data.substr(5) + "\n";
        }
        else {outputPrefaceError();}
    }
}

function show(lineNum, response) {
    switch (lang) {
        case "frink":
            return showFrink(lineNum, response);
        case "apl":
            return showApl(lineNum, response);
        default:
          console.error(`Error: lang = "${lang}" not found.`);
          return "ERROR";
      }
}

function showFrink(lineNum, response) {
    // console.log("line " + lineNum + ":", response);
    if (response.err != "") {
        return "?";
    }
    else {
        return response.out.substr(0, response.out.indexOf("\n"));
    }
}

function showApl(lineNum, response) {
    console.log("line " + lineNum + ":", response);
    // if ((response.err.split("\n").length-1) > 1) {
    if (response.err != "") {
        return "?";
    }
    else {
        // return response.out;
        return response.out.substr(0, response.out.indexOf("\n"));
    }
    return ""

}

// ws.onmessage = function(event) {
//     if (event.data == 'Frink - Copyright 2000-2022 Alan Eliasen, eliasen@mindspring.com.') {} 
//     else if (event.data == 'out: 666666') {
//         firstLine = true;
//         queue.shift();
//         // console.log("output:", queue);
//     }
//     else if (firstLine == true) {
//         let output = "";
//         console.log(event.data)
//         if (event.data.substr(0,5) == "err: " || isError(event.data)) {
//             output = "?"; 
//         }
//         else if (isBlank(event.data)) {
//             output = "";
//         }
//         else if (event.data.substr(0,5) == "out: ") {
//             output = event.data.substr(5);
//         }
//         else {outputPrefaceError();}
//         let children = document.getElementById('right').children;
//         children[queue[0]].innerHTML = output;
//         firstLine = false;
//     }
//     else {
//         if (event.data.substr(0,5) == "out: ") {
//             output = event.data.substr(5);
//             console.log(`Additional stdout for line ${queue[0]}: ${output}`)
//         }
//         else if (event.data.substr(0,5) == "err: ") {
//             output = "?"; 
//             console.log(`Additional stderr for line ${queue[0]}: ${output}`)
//         } 
//         else {outputPrefaceError();}
//     }
// }

function outputPrefaceError() {
    console.error("This shouldn't happen. It should either be prefaced with 'out: ' or 'err: '.")
}

function isError(output) {
    return output.includes('error') || output.includes('undefined'); // || output.includes('unknown');
    // return false;
}

// function isBlank(output) {
//     return output.includes('(')
// }