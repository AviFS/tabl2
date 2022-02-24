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
            if (!show.patient) { updateLine(show.errorString); }
            // when patient don't change anything a la numi
            return;
        }
        updateLine(response.out)
    }
}