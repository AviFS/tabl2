num = "(.)?"

expr = num + "e" + num
const re = new RegExp("^"+expr+"$")

let inps = `
def
ep
ke
nomatch
`.trim()

for (const inp of inps.split('\n')) {
    let matches = inp.match(re)
    console.log(matches)
}