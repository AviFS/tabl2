class Frink {

    static init() {
        [
            // "showApproximations[false]",
            "rationalAsFloat[true]",
            "setPrecision[10]",
            "showDimensionName[false]",
        ].forEach(code => send(ws, {"code": code}));
        // More efficient if .join(";") and send it in one JSON
    }

}