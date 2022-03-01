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

import json

class Data:
    
    def __init__(self):
        self.line = 0
        self.disp = "" 
        self.output = ""
        self.isError = False

        self.state = []

        self.console_log = ""
        self.console_warn = ""
        self.console_error = ""

        self.debug_line = 0
        self.debug_code = ""
        # self.debug_input = ""
    
    def parse(self, data):
        line, code = data[:3], data[5:]
        self.line = int(line) # takes care of leading zeroes
        self.debug_code = code
        return line, code
    
    def log(self, msg):
        self.console_log += msg
    def warn(self, msg):
        self.console_warn = msg
    def error(self, msg):
        self.console_error = msg
    
    def print(self, msg, end="\n"):
        res = str(msg) + end
        self.output += res
    
    def format(self):
        data = {
            "line": self.line,
            "disp": self.disp,
            "output": self.output,
            "isError": self.isError,
            "console": {
                "log": self.console_log,
                "warn": self.console_warn,
                "error": self.console_error,
            },
            "debug": {
                "code": self.debug_code,
            },
        }
        return json.dumps(data)

data = Data()
data.parse('021:\' 1\ \n " 2 ""3+,')
print(data.format())

# if len(sys.argv) < 2:
#     data.log += "sys.argv.length == 1"
#     data.log += "defaulting to empty input"
#     inp = []
# else:
#     inp = sys.argv[1].split(',')

inp = []
def input(prompt):
    return inp.pop()



def mod_repl():

    ctx, stack = Context(), []
    # ctx.online = True
    ctx.repl_mode = True


    while True:
        data = Data()
        line, code = data.parse(__input())

        vyxal.__builtins__["input"] = input
        vyxal.__builtins__["print"] = data.print

        try:
            exec(transpile(code))
        except Exception as e:
            data.console_error += str(e)
    
        for item in stack:
            if isinstance(item, sympy.Basic):
                data.state.append(str(item))
            elif isinstance(item, (list, dict)):
                data.state.append(json.dumps(item))
            elif isinstance(item, str):
                data.state.append(json.dumps(item))
            else:
                data.console_warn += f"server: type {type(item)} not handled"
                data.state.append(json.dumps(str(item)))

        data.disp = ' '.join(data.state)
        __print(data.format())
        stack = []


# __print(f"in: {inp}")
mod_repl()