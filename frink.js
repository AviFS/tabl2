class Frink extends Lang {
    static cmds = [
        // "showApproximations[false]",
        "rationalAsFloat[true]",
        "setPrecision[10]",
        "showDimensionName[false]",
    ];

    // Core Functions
    static reformat(response) {

        let data = {"out": "", "err": "", "log": ""}
        for (const line of response.stdout.split("\n")) {
            // if (isIgnore(line)) { data.ignored += line; }
            if (Frink.isIgnore(line)) {}
            else if (Frink.isError(line)) { data.err += line; }
            else { data.out += line; }
        }

        data.log = response.stderr;
        return data;
    }

    // Helper Functions
    static isError(output) {
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

    // static isBlank(output) {
    //     return output.includes('(')
    // }
}