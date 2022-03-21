class Utils {

    // I can't believe such simple things are so annoying to make behave properly in JS
    static round(num, places) {
        let p = places;
        return +(Math.round(num + "e+"+p)  + "e-"+p);
    }

}