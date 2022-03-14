class Lang {

    static getAddress(localhost) {
        console.error("getAddress() must be overwritten.")
    }
    
    static foo() {
        return 9991;
    }

    static whichLines(lines) {
        // return lines;
        function range (a,b) { return Array.from({length:b-a},(_,i)=>i+a); }
        let children = document.getElementById('right').children;
        return range(0, children.length);
    }

    static init() {
        // Empty by default
    }

    static formatJSON(data) {
        return {
            line: data.hasOwnProperty('line')? data.line: 0,
            code: data.hasOwnProperty('code')? data.code: "",
            input: data.hasOwnProperty('input')? data.input: "",
            reset: data.hasOwnProperty('reset')? data.reset: false,
            state: data.hasOwnProperty('state')? data.state: [],
        };
    }
}