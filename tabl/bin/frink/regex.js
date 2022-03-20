num = "(.)?"

expr = num + "e" + num
const re = new RegExp(expr)

let inp = "fel"

let matches = inp.match(re)

console.log(matches)