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
            let newLine = false;
            newLine ? ws.send(line+"\n"): ws.send(line);
            // console.log(i+": ", line)
        }
            queue.push(i);
        // ws.send(lang.delimiter_in)
        // TODO: this should really push a pair queue.push((lineNum, lineContent))
    console.log(line);
    }
    // console.log("in: ",queue)
    // console.log("input: ", queue);
}

function outputPrefaceError() {
    console.error("This shouldn't happen. It should either be prefaced with 'out: ' or 'err: '.")
}

function _onopen (event) {
    for (const cmd of lang.cmds) {
        ws.send(cmd);
    }
}

function _onmessage(event) {
    console.log("out: ", queue)
    let response = JSON.parse(event.data)
    lang.show(queue[0], lang.reformat(response));
    queue.shift();
}

function lineElement(queue) {
    return document.getElementById('right').children[queue[0]];
}

function updateLine(data) {
    console.log(queue);
    // console.log()
    document.getElementById('right').children[queue[0]].innerHTML = data;
}

function testWebSocket() {

    let ws = new WebSocket('ws://127.0.0.1:8000/');

    ws.onopen = function(event) {
        console.debug("Passed: Opened connection")
        ws.send(lang.delimiter_in);
    }

    ws.onclose = function(event) {
        // this is not necessary
        console.debug("Passed: Closed connection")
    }

   ws.onmessage = function (event) {
       if (event.data != lang.delimiter_out) {
           console.error([
                `Failed: Delimiter Test`,
                `   Got       '${lang.delimiter_in}' -> '${event.data}'`,
                `   Expected  '${lang.delimiter_in}' -> '${lang.delimiter_out}'`,
           ].join('\n'))
        }
        else {
            console.log("Passed: Delimiter Test");
        }
        ws.close();
    }

//         console.error(`\
// Failed: Delimiter Test
//     Input        '${lang.delimiter_in}'
//     Output       '${event.data}'
//     Expected     '${lang.delimiter_out}'
// `)
}