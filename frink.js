class Frink {
    static delimiter = "out: 666666";
    static cmds = [
        // "showApproximations[false]",
        "rationalAsFloat[true]",
        "setPrecision[10]",
        "showDimensionName[false]",
    ];

    static parseResponse(streams) {
        let data = {"out": "", "err": "", "log": ""}
        for (const line of streams.stdout.split("\n")) {
            // if (isIgnore(line)) { data.ignored += line; }
            if (Frink.isIgnore(line)) { }
            else if (Frink.isLog(line)) { data.log += line; }
            else { data.out += line; }
        }
        data.err = streams.stderr;
        return data;
    }

    static show(lineNum, streams) {
        let data = Frink.parseResponse(streams);
        console.log(data)

        let lineElement = document.getElementById('right').children[queue[0]];
        if (data.log.length != 0) {
            // lineElement.innerHTML = "? ";
            // don't change anything a la numi
            return;
        }
        console.log(data.out)
        lineElement.innerHTML = data.out;
    }


   static isLog(output) {
        return output.includes('error') ||
        output.includes('undefined') ||
        output.includes('cannot') ||
        output.includes('Unrecognized') ||
        output.includes('parse') ||
        output.includes('missing'); // || output.includes('unknown');
    }

    static isIgnore(output) {
        return output == "Frink - Copyright 2000-2022 Alan Eliasen, eliasen@mindspring.com.";
    }

    static isBlank(output) {
        return output.includes('(')
    }
}