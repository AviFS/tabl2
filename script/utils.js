class Utilss {

    // I can't believe such simple things are so annoying to make behave properly in JS
    static round(num, places) {
        let p = places;
        return +(Math.round(num + "e+"+p)  + "e-"+p);
    }

    static range (a,b) { return Array.from({length:b-a},(_,i)=>i+a); }

    static fill(obj, n) { let acc=[]; for (let i=0;i<n;i++) acc.push(obj); return acc;}

}