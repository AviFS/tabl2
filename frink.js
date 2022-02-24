let delimiter = "out: 666666"
let cmds = [
    // "showApproximations[false]",
    "rationalAsFloat[true]",
    "setPrecision[10]",
    "showDimensionName[false]",
]

function parseResponse(response) {
    data = {"out": "", "err": "", "log": ""}
    for (const line of streams.stdout.split("\n")) {
        // if (isIgnore(line)) { data.ignored += line; }
        if (isIgnore(line)) { }
        else if (isLog(line)) { data.log += line; }
        else { data.out += line; }
    }
    data.err = streams.stderr;
    return data;
}

function show(lineNum, streams) {
    let data = parseResponse(streams);
    console.log(data)

    let lineElement = document.getElementById('right').children[queue[0]];
    if (data.log.length != 0) {
        // lineElement.innerHTML = "? ";
        // don't change anything a la numi
        return;
    }
    lineElement.innerHTML = data.out;
}


function isLog(output) {
    return output.includes('error') ||
    output.includes('undefined') ||
    output.includes('cannot') ||
    output.includes('Unrecognized') ||
    output.includes('parse') ||
    output.includes('missing'); // || output.includes('unknown');
}

function isIgnore(output) {
    return output == "Frink - Copyright 2000-2022 Alan Eliasen, eliasen@mindspring.com.";
}

function isBlank(output) {
    return output.includes('(')
}