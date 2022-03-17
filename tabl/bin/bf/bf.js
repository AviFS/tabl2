let bf = (code, input = '') => {
    code = [...code];
    let start_indices = [];
    for (let i = 0; i < code.length; i++) {
      if (code[i] == '[') start_indices.push(i);
      if (code[i] == ']') start_indices.pop();
    }
    code = code.filter((char, i) => !start_indices.includes(i))

    var tape = [0], tapeIndex = 0, tapeLimit = Infinity, cellLimit = 256, output = '';
  input = [...input];
  let codeTable = {
      '+': 'tape[tapeIndex] = (tape[tapeIndex] + 1) % cellLimit',
      '-': 'tape[tapeIndex] = tape[tapeIndex] ? tape[tapeIndex] - 1 : cellLimit - 1',
      '>': 'tapeIndex = (tapeIndex + 1) % tapeLimit',
      '<': 'tapeIndex = tapeIndex ? tapeIndex - 1 : Number.isFinite(tapeLimit) ? tapeLimit - 1 : tape.unshift(0) && 0',
      '[': 'while(tape[tapeIndex]){',
      ']': '}',
      '.': 'output += String.fromCharCode(tape[tapeIndex])',
      ',': 'tape[tapeIndex] = input.shift().charCodeAt()',
  }
  let transpiled = '';
  for(let char of code){
      if(char in codeTable){
          transpiled += codeTable[char] + '\n'
      }
  }
  eval(transpiled);
    return output;
}