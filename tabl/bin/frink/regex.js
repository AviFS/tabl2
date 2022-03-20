let float = String.raw `(-?\d+(?:\.\d+)?)`; // float or int

let int = String.raw `(-?\d+)`;
let frac = String.raw `${int}\/${int}`

let imaginary = String.raw ` (i)?`

// i'm realizing that since you can change the base/display units, i should really just generalize this
// to match any [text]^[int], and do a repeated thing of that capturing both the unit and exp for each

let approx = String.raw `(exactly|approx\.) ${float}`;
let unit = (base) => String.raw `( ${base}(?:\^${int})?)?`; // note the leading space is already included
// list from: https://frinklang.org/#HowFrinkIsDifferent
// i then ran it in the frink repl to see how it outputs and in what fixed order the units get displayed:
//     m kg s A cd mol K bit USD
//     1 m s kg A K dollar mol bit cd (unknown unit type)
let baseUnits = ["m", "s", "kg", "A", "K", "dollar", "mol", "bit", "cd"].slice(0,3)

// let p1 = String.raw `(?:${float}|${frac})`;
let p1_a = String.raw `${float}`
let p1_b = String.raw `${frac} \(${approx}\)`
let p1 = String.raw `(?:${p1_a}|${p1_b})`

let p2 = baseUnits.map(unit).join(""); // again, note these are joined with the empty string, not a space


let expr = p2;
expr = "^"+float+expr+"$";
// console.log(expr);
const re = new RegExp(expr)

// let inps = `
// 1/4 (exactly 0.25)
// 0.8
// 2/3 (approx. 0.666666)
// 2045
// `.trim()

let inps = `
0.5 m s kg
3 s^2
4 m s^-1 kg
2.9 m^3 kg^2
`.trim()

for (const inp of inps.split('\n')) {
    let matches = inp.match(re)
    if (matches == null) {
        console.log("null")
    }
    else {
        console.log(matches.slice(1).map(x => x==undefined? '_': x).map(x => x.padStart(6, ' ')).join(' '));
        // console.log(`${(matches[0]+':').padEnd(20, ' ')} ${matches.slice(1).map(x => x==undefined? '_': x).map(x => x.padStart(6, ' ')).join(' ')}`);
        // console.log(matches)
    }
}