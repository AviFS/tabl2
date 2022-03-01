import sys
import types
import re
from typing import Type
import sympy

import vyxal.encoding
from vyxal.context import Context
from vyxal.elements import *
from vyxal.helpers import *
from vyxal.transpile import transpile

from builtins import print as __print
from builtins import input as __input

import json

def error(msg):
    data = Data()
    data.console_error = msg
    __print(data.format())
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

        # self.debug_line = 0
        self.debug_code = ""
        # self.debug_input = ""
        # self.debug_reset = False
    
    def parse(self, data):
        data = json.loads(data)
        line, code, inp, reset, state = data['line'], data['code'], data['input'], data['reset'], data['state']
        self.line = int(line) # takes care of leading zeroes
        self.debug_code = code
        return line, code, inp, reset, state
    
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

inp = []
def input(prompt):
    return inp.pop()

def pprint(data, stack):
    acc = []
    for item in stack:
        if isinstance(item, sympy.Basic):
            acc.append(str(item))
        elif isinstance(item, (list, dict, int)):
            acc.append(json.dumps(item))
        elif isinstance(item, str):
            acc.append(json.dumps(item))
        else:
            data.console_warn += f"server: type {type(item)} not handled"
            acc.append(json.dumps(str(item)))

    return ' '.join(acc)

def repl(disable_json = False, multiline=False):

    ctx, stack = Context(), []
    # ctx.online = True
    ctx.repl_mode = True


    while True:
        data = Data()
        if disable_json:
            code = __input()
        else:
            try:
                line, code, inp, reset, state = data.parse(__input())
            except (TypeError, KeyError, json.decoder.JSONDecodeError):
                data.error("Server: Invalid JSON")
                __print(data.format())
                continue
        
        if reset:
            data.isError = True
            stack = []
        
        if state:
            stack = state

        vyxal.__builtins__["input"] = input
        vyxal.__builtins__["print"] = data.print

        try:
            exec(transpile(code))
        except Exception as e:
            data.console_error += str(e)
            data.isError = True
    
        data.state = stack
        data.disp = pprint(data, stack)

        __print(data.format())

        if multiline:
            stack = []

if __name__ == "__main__":
    repl()