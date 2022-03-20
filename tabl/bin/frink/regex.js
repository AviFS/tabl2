let float = String.raw `(-?\d+(?:\.\d+)?)`; // float or int

let int = String.raw `(-?\d+)`;
let frac = String.raw `${int}\/${int}`

let approx = String.raw `(exactly|approx\.) ${float}`;
let unit = (base) => String.raw `(?: ${base}(?:\^${int})?)?`; // leading space required for match

// let p1 = String.raw `(?:${float}|${frac})`;
let p1_a = String.raw `${float}`
let p1_b = String.raw `${frac} \(${approx}\)`
let p1 = String.raw `(?:${p1_a}|${p1_b})`

let p2 = String.raw `23`

let expr = `1${unit("kg")}`;
expr = "^"+expr+"$";
console.log(expr);
const re = new RegExp(expr)

// let inps = `
// 1/4 (exactly 0.25)
// 0.8
// 2/3 (approx. 0.666666)
// 2045
// `.trim()

let inps = `
1 kg
1 kg^2
1 kg^29304
1 kg^-3
`.trim()

for (const inp of inps.split('\n')) {
    let matches = inp.match(re)
    if (matches == null) {
        console.log("null")
    }
    else {
        console.log(`${matches[0]}: ${matches.slice(1).join(' ')}`);
        // console.log(matches)
    }
}