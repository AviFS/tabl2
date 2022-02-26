class Cat extends Lang {

    // static delimiter_in = "302932"
    // static delimiter_out = "302932"
    // static reformat(response) {
    //     // return {out: response.stdout, err: ""}
    //     return {out: response.stdout, err: response.stderr}
    // }

}

class Vyxal extends Lang {

    static reformat(response) {
        function pprintState(state) {
            // console.log(state)
            // return state.join(' ');

            // return JSON.stringify(state);
            return state;
        }
        let data =  {"line": response.line, "out": pprintState(response.state), "err": response.err}
        // console.log(4,data)
        return data;
    }

}