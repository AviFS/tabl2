class Pip extends Lang {

    static name = "Pip";

    static getAddress(localhost) {
        if (localhost) {
            return 'ws://127.0.0.1:8007';
        }
        return 'ws://167.71.240.216:8007/';
    }
    
    static whichLines(lines) {
        return lines;

        // function range (a,b) { return Array.from({length:b-a},(_,i)=>i+a); }
        // let children = document.getElementById('right').children;

        // return range(0, children.length);
    }
}