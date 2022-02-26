class Lang {
    // static delimiter = {in: "666666", out: "out: 666666"};
    static delimiter_in = "666666";
    static delimiter_out = "out: 666666";

    static cmds = [];

    static reformat(response) {
        // return {out: response.out, err: response.err}
        return response;
    }

    static show(lineNum, response) {
        console.log(response);
        // console.log(lineNum+": ",response);
        // console.log(response);
        line = response.line;
        console.log(line)
        if (response.err.length != 0) {
            if (!show.patient) { updateLine(line, show.errorString); }
            // when patient don't change anything a la numi
            return;
        }
        console.log(9,response.out)
        updateLine(line, response.out)
    }
}