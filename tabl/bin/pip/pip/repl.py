import sys
import json
import pip

from builtins import print as __print
# from builtins import input as __input


stdout = ""
stderr = ""

def print(msg, end="\n", file=sys.stdout):
    global stdout, stderr
    if file == sys.stdout:
        stdout += str(msg)+end
    else:
        stderr += str(msg)+end

def run(code, argv=[5,8,2]):
    global stdout, stderr
    stdout, stderr = "", ""
    pip.pip(code, argv)
    result = {"disp": stdout, "console": {"error": stderr}}
    return result

# pip.__builtins__["input"] = input
pip.__builtins__["print"] = print

# run("LaPi::o+:i", 4) 
# run("LaPi::o+:i", 3) 
# run("3+4")

# __print(jsonified)

def repl(disable_json=False):
    while True:
        try:
            inp = input()
        except (EOFError):
            __print("Server: EOF")
            break
        if not disable_json:
            inputJSON = json.loads(inp)
        else:
            inputJSON = {"line": 0, "code": inp, "input": [5,8,2]}

        try:
            outputJSON = run(inputJSON['code'], inputJSON['input'])
        except Exception as e:
            outputJSON['err'] += e
            outputJSON['isError'] = True
        else:
            outputJSON['isError'] = False
        
        outputJSON['line'] = inputJSON['line']
            
        __print(json.dumps(outputJSON))


# repl(disable_json=True)
repl()

# Test with:
#    python3 repl.py < pip.in