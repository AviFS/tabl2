class Lang {
    // static delimiter = {in: "666666", out: "out: 666666"};
    static delimiter_in = "666666";
    static delimiter_out = "out: 666666";

    static cmds = [];

    static reformat(response) {
        return {out: response.stdout, err: response.stderr}
    }

    static show(lineNum, response) {
        // console.log(response);
        if (response.err.length != 0) {
            // lineElement.innerHTML = "? ";
            // don't change anything a la numi
            return;
        }
        updateLine(response.out)
    }
// rename parseResponse() to reformat()

// and by default here have it be
// function reformat(response) { return response; }

// and in scratch.js change it from:
//         lang.show(queue[0], streams);
// to:
//         lang.show(queue[0], reformat(streams));

}