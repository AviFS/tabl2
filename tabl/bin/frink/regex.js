let float = String.raw `(-?\d+(?:\.\d+)?)`; // float or int

let int = String.raw `(-?\d+)`;
let frac = String.raw `${int}\/${int}`

let imaginary = String.raw ` (i)?`

// i'm realizing that since you can change the base/display units, i should really just generalize this
// to match any [text]^[int], and do a repeated thing of that capturing both the unit and exp for each

let approx = String.raw `(exactly|approx\.) ${float}`;
// let unit = (base) => String.raw `(?: ${base}(?:\^${int})?)?`; // this used to just be a capture group, but has to be a match group because of the m^0 vs m^1 edge case
let unit = (base) => String.raw `(?: (${base})(?:\^${int})?)?`; // note the leading space is already included
// list from: https://frinklang.org/#HowFrinkIsDifferent
// i then ran it in the frink repl to see how it outputs and in what fixed order the units get displayed:
//     m kg s A cd mol K bit USD
//     1 m s kg A K dollar mol bit cd (unknown unit type)
let baseUnits = ["m", "s", "kg", "A", "K", "dollar", "mol", "bit", "cd"]
let dimension = String.raw `((?:unknown unit type)|(?:[a-z_]+))`

// let p1 = String.raw `(?:${float}|${frac})`;
let p1_a = String.raw `${float}`
let p1_b = String.raw `${frac} \(${approx}\)`
let p1 = String.raw `(?:${p1_a}|${p1_b})`
let p2 = baseUnits.map(unit).join(""); // again, note these are joined with the empty string, not a space
let p3 = String.raw `(?: \(${dimension}\))?`

let base = String.raw `${p1}${p2}${p3}`
let expr = base;


expr = "^"+expr+"$";
// console.log(expr);
const re = new RegExp(expr)

// let inps = `
// 1/4 (exactly 0.25)
// 0.8
// 2/3 (approx. 0.666666)
// 2045
// `.trim()

let inps = `
1/4 (exactly 0.25) m s^-2 kg (force)
0.2
`.trim()

// inps = `
// 5
// 5 dollar
// 5 dollar^2
// `.trim()

function printMatches(matches) {
    console.log(
        matches.slice(1).
        map(x => x==undefined? '_': x).
        // map(x => x.padStart(6, ' ')).
        join(' ')
    );
    // console.log(`${(matches[0]+':').padEnd(20, ' ')} ${matches.slice(1).map(x => x==undefined? '_': x).map(x => x.padStart(6, ' ')).join(' ')}`);
    // console.log(matches)
}

for (const inp of inps.split('\n')) {
    let matches = inp.match(re)
    if (matches == null) {
        console.log("null")
    }
    else {
        let out = {};

        let original = matches[0];
        let numeric = matches.slice(1,6);
        let units = matches.slice(6, matches.length-1)
        let dimension = matches[matches.length-1];

        out.dimension = dimension == undefined? "scalar": dimension;

        let [primaryFloat, numerator, denominator, exactApprox, fracToFloat] = numeric;

        [primaryFloat, numerator, denominator, exactApprox, fracToFloat] = [
            parseFloat(primaryFloat),
            parseInt(numerator),
            parseInt(denominator),
            String(exactApprox),
            parseFloat(fracToFloat),
        ];

        // [primaryFloat, fracToFloat] = [primaryFloat, fracToFloat].map(parseFloat);
        // [numerator, denominator] = [numerator, denominator].map(parseInt);
        // [exactApprox] = [exactApprox].map(String);

        if (!isNaN(primaryFloat)) {
            out.decimal = primaryFloat;
        }
        else {
            out.fraction = [numerator, denominator];
            
            switch (exactApprox) {
                case "exactly":
                    out.isExact = true;
                    break;
                case "approx.":
                    out.isExact = false;
                    break;
                default:
                    console.error(`Frontend: Expected 'exactly' or 'approx.', but got ${exactApprox}`)
            }

            out.decimal = fracToFloat;
        }


        out.units = [];
        for (let i=0; i<units.length; i+=2) {
            
            let base = units[i];
            let exp = units[i+1];

            if (base == undefined) {
                out.units.push(0);
            }
            if (base != undefined && exp == undefined) {
                out.units.push(1);
            }
            if (base != undefined && exp != undefined) {
                out.units.push(parseFloat(exp));
            }

            // the above are all mutually exclusive so this also works
            // somehow i'm finding the one above easier to read for now though
            // not necessarily inherently, but it feels like it maps onto the logic of the regex better
            // without trying to make fancy shortcuts that just obfuscate the regex logic taken
            // but according to every style convention and gut instinct, i'm sure the below is better
            // we'll see when i look at it with fresh eyes if i still agree with me

            // if (base == undefined) {
            //     out.units.push(0);
            // }
            // else {
            //     if (exp == undefined) {
            //         out.units.push(1);
            //     }
            //     out.units.push(parseFloat(exp));
            // }

        }

        console.log(out)

        // printMatches(matches);
        // console.log(matches);
        // break;
    }
}