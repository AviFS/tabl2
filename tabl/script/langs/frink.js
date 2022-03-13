class Frink extends Lang {

    static getAddress(localhost) {
        if (localhost) {
            return 'ws://127.0.0.1:8002';
        }
        return 'ws://54.153.39.161:8884/';

    }

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