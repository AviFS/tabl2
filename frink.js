let frink = {
    delimiter: "out: 666666",
    cmds: [
        // "showApproximations[false]",
        "rationalAsFloat[true]",
        "setPrecision[10]",
        "showDimensionName[false]",
    ],

    parseResponse: function (streams) {
        data = {"out": "", "err": "", "log": ""}
        for (const line of streams.stdout.split("\n")) {
            // if (isIgnore(line)) { data.ignored += line; }
            if (frink.isIgnore(line)) { }
            else if (frink.isLog(line)) { data.log += line; }
            else { data.out += line; }
        }
        data.err = streams.stderr;
        return data;
    },

    show: function(lineNum, streams) {
        let data = frink.parseResponse(streams);
        console.log(data)

        let lineElement = document.getElementById('right').children[queue[0]];
        if (data.log.length != 0) {
            // lineElement.innerHTML = "? ";
            // don't change anything a la numi
            return;
        }
        console.log(data.out)
        lineElement.innerHTML = data.out;
    },


    isLog: function(output) {
        return output.includes('error') ||
        output.includes('undefined') ||
        output.includes('cannot') ||
        output.includes('Unrecognized') ||
        output.includes('parse') ||
        output.includes('missing'); // || output.includes('unknown');
    },

    isIgnore: function(output) {
        return output == "Frink - Copyright 2000-2022 Alan Eliasen, eliasen@mindspring.com.";
    },

    isBlank: function(output) {
        return output.includes('(')
    }
}
console.log(frink)