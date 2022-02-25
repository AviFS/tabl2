class Cat extends Lang {

    // static delimiter_in = "302932"
    // static delimiter_out = "302932"
    static reformat(response) {
        // return {out: response.stdout, err: ""}
        return {out: response.stdout, err: response.stderr}
    }

}