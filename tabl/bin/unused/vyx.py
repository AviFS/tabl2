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
import builtins

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
        # self.debug_code = ""
        # self.debug_input = ""
        # self.debug_reset = False
        self.debug = "23" 

        self.inp = []

    def parse(self, data):
        data = json.loads(data)
        line, code, inp, reset, state = data['line'], data['code'], data['input'], data['reset'], data['state']
        self.inp = inp.strip().split(' ')
        self.line = int(line) # takes care of leading zeroes
        # self.debug = {"line": line, "code": code, "input": inp, "reset": reset, "state": state}
        # self.debug = json.dumps({"line": line, "code": code, "input": inp, "reset": reset, "state": state})
        # self.output_print(self.debug)
        # self.debug = "52"
        # self.output_print("2323423423")
        # builtins.print(self.debug)
        return line, code, inp, reset, state
    
    def log(self, msg):
        self.console_log += msg
    def warn(self, msg):
        self.console_warn = msg
    def error(self, msg):
        self.console_error = msg
    
    def output_print(self, msg, end="\n"):
        res = str(msg) + end
        self.output += res
    
    def disp_print(self, msg, end="\n"):
        res = str(msg) + end
        self.disp += res
    
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
            "debug": self.debug,
        }
        return json.dumps(data)

    inp = []
    def input(self, prompt):
        return self.inp.pop()

# def pprint(data, stack):
#     acc = []
#     for item in stack:
#         if isinstance(item, sympy.Basic):
#             acc.append(str(item))
#         elif isinstance(item, (list, dict, int)):
#             acc.append(json.dumps(item))
#         elif isinstance(item, str):
#             acc.append(json.dumps(item))
#         elif isinstance(item, LazyList):
#             acc.append("["+pprint(data, item)+"]")
#         else:
#             data.console_warn += f"server: type {type(item)} not handled"
#             acc.append(json.dumps(str(item)))

#     return ' '.join(acc)


def _vy_print(lhs, end="\n", ctx=None):
    """Element ,
    (any) -> send to stdout
    """
    ctx.printed = True
    ts = vy_type(lhs)

    if ts is LazyList:
        lhs[0].output(end=end, ctx=ctx)
        _vy_print("23092", end=end, ctx=ctx)
    elif ts is list:
        # _vy_print(vy_str(lhs[0:20], ctx=ctx), end, ctx)
        # print("--<23>--")
        # lhs[0].output(end=end, ctx=ctx)
        # print(vy_str(lhs[0], ctx=ctx))
        # print(lhs[0].output(end=end, ctx=ctx))
        if vy_type(lhs[0]) is LazyList:
            print("<lst>")
        # print(vy_type(lhs[0]))
    elif ts is types.FunctionType:
        res = lhs(ctx.stacks[-1], lhs, ctx=ctx)[
            -1
        ]  # lgtm[py/call-to-non-callable]
        _vy_print(res, ctx=ctx)
    else:
        if is_sympy(lhs):
            if ctx.print_decimals:
                lhs = str(float(lhs)).strip(".0")
            else:
                lhs = sympy.nsimplify(lhs.round(20), rational=True)
        if ctx.online:
            ctx.online_output[1] += vy_str(lhs, ctx=ctx) + end
        else:
            print(lhs, end=end)

def disp_format(out):
    out = out.strip()
    out = out[1:-1] # remove outer brackets
    out = out.replace('[', '(').replace(']', ')')
    out = out.replace(',', '')
    return out

def repl(disable_json = False, multiline=False):

    ctx, stack = Context(), []
    # ctx.online = True
    ctx.repl_mode = True
    ctx.vyxal_lists = False


    while True:
        data = Data()
        try:
            if disable_json:
                line, code, inp, reset, state = 0, __input(), "", False, []
            else:
                line, code, inp, reset, state = data.parse(__input())
        except (TypeError, KeyError, json.decoder.JSONDecodeError):
            data.error("Server: Invalid JSON")
            __print(data.format())
            continue
        except (EOFError):
            data.error("Server: EOF")
            __print(data.format())
            break

        if reset:
            data.isError = True
            stack = []
        
        if state:
            stack = state

        vyxal.__builtins__["input"] = data.input
        vyxal.__builtins__["print"] = data.output_print

        try:
            exec(transpile(code))
        except Exception as e:
            data.console_error += str(e)
            data.isError = True
    
        data.state = stack
        vyxal.__builtins__["print"] = data.disp_print
        _vy_print(stack, ctx=ctx)
        # __print(data.debug)
        data.disp = disp_format(data.disp)
        vyxal.__builtins__["print"] = data.output_print
        # data.disp = 


        __print(data.format())

        if multiline:
            stack = []

if __name__ == "__main__":
    # repl()
    repl(disable_json=True, multiline=True)