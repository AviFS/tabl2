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
    result = {"out": stdout, "err": stderr}
    jsonified = json.dumps(result)
    __print(jsonified)

# pip.__builtins__["input"] = input
pip.__builtins__["print"] = print

# run("LaPi::o+:i", 4) 
# run("LaPi::o+:i", 3) 
# run("3+4")

# __print(jsonified)

# while True:
#     code = input()
#     run(code)
