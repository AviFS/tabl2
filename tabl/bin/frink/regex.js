let float = String.raw `(\d+(?:\.\d+)?)`; // float or int

let int = String.raw `(\d+)`;
let frac = String.raw `${int}\/${int}`

let expr = `(?:${float}|${frac})`;

console.log(expr);
const re = new RegExp("^"+expr+"$")

let inps = `

1/4
23
23/695
0.234

`.trim()

for (const inp of inps.split('\n')) {
    let matches = inp.match(re)
    if (matches == null) {
        console.log("null")
    }
    else {
        console.log(`${matches[0]}: ${matches.slice(1).join(' ')}`);
    }
}