import sys
import types
import re
import sympy

import vyxal.encoding
from vyxal.context import Context
from vyxal.elements import *
from vyxal.helpers import *
from vyxal.transpile import transpile

from builtins import print as __print
from builtins import input as __input

class data:
    line = 0
    output = ""
    state = [] 

    log = ""
    warn = ""
    error = ""

if len(sys.argv) < 2:
    # data.log += "sys.argv.length == 1"
    # data.log += "defaulting to empty input"
    inp = []
else:
    inp = sys.argv[1].split(',')

def print(msg, end="\n"):
    # __print(msg)
    res = str(msg) + end
    data.out += escape(res)

def input(prompt):
    return inp.pop()

vyxal.__builtins__["input"] = input
vyxal.__builtins__["print"] = print




### HELPERS ###
import json
def escape(msg):
    return json.dumps(msg)[1:-1]

def format(data):
    console = f'{{ "log": {json.dumps(data.log)}, "warn": {json.dumps(data.warn)}, "error": {json.dumps(data.error)} }}'
    return f'{{ "line": {data.line}, "output": "{data.out}", "isError": {len(data.err)}  "disp": {data.state}, "console": {console} }}'
    # return f'{{ "line": {data.line}, "out": "{data.out}",  "disp": {data.state} }}'#, console: {console} }}'
################

def mod_repl():


    ctx, stack = Context(), []

    # ctx.online = True
    ctx.repl_mode = True

    while True:
        data.out, data.console.error = "", ""
        data.state = []
        
        inp = __input()
        if (not re.match("^\d{3}: .*$", inp)):
            __print("error: expecting \d\d\d: code")
            continue

        line, code = inp[:3], inp[5:]
        data.line = int(line) # takes care of leading zeroes

        try:
            exec(transpile(code))
        except Exception as e:
            data.console.error += escape(str(e))
    
        for item in stack:
            if isinstance(item, sympy.Basic):
                data.state.append(str(item))
            elif isinstance(item, (list, dict)):
                data.state.append(json.dumps(item))
            elif isinstance(item, str):
                data.state.append(json.dumps(item))
            else:
                data.console.error += f"server warning: type {type(item)} not handled"
                data.state.append(json.dumps(str(item)))
        
            # if isinstance(item, )

            # print(type)
            # if isinstance(item, (list)):
            #     data.state.append(item)
            # elif isinstance(item, sympy.Basic):
            #     data.state.append(item)
            # elif isinstance(item, str):
            #     data.state.append(item)
            # elif isinstance(item, types.FunctionType):
            #     data.state.append("FUNC")
            # else:
            #     # data.state.append(escape(str(item)))
            #     data.state.append("?")
            #     __print(f"warning: type {type(item)} not handled")
            #     __print(f"\tusing str would give: {str(item)}")
            
            # # data.state = json.dumps(data.state)

        # def convert(o):
        #     if isinstance(o, sympy.Basic): return o.item()  
        #     raise TypeError

        # data.state = json.dumps(data.state), default=convert)
        # class Convert(json.JSONEncoder):
        #     def default(self, obj):
        #         if isinstance(obj, complex):
        #             return [obj.real, obj.imag]
        #         # Let the base class default method raise the TypeError
        #         return json.JSONEncoder.default(self, obj)

        # data.state = json.dumps(data.state)

        data.state = '['+', '.join(data.state)+']'
        __print(format(data))
        stack = []


# __print(f"in: {inp}")
mod_repl()