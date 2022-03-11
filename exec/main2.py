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


def pprint(data, stack):
    acc = []
    for item in stack:
        if isinstance(item, sympy.Basic):
            acc.append(str(item))
        elif isinstance(item, (list, dict, int)):
            acc.append(json.dumps(item))
        elif isinstance(item, str):
            acc.append(json.dumps(item))
        elif isinstance(item, LazyList):
            acc.append("["+pprint(data, item)+"]")
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

# if __name__ == "__main__":
#     repl()



def vy_print(lhs, end="\n", ctx=None):
    """Element ,
    (any) -> send to stdout
    """
    ctx.printed = True
    ts = vy_type(lhs)

    if ts is LazyList:
        lhs.output(end=end, ctx=ctx)
    elif ts is list:
        vy_print(vy_str(lhs, ctx=ctx), end, ctx)
    elif ts is types.FunctionType:
        res = lhs(ctx.stacks[-1], lhs, ctx=ctx)[
            -1
        ]  # lgtm[py/call-to-non-callable]
        vy_print(res, ctx=ctx)
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


code = """
1

3 3 2+
2 5r
"""


ctx, stack = Context(), []
ctx.repl_mode = True
ctx.vyxal_lists = False

for line in code.strip().split('\n'):
    exec(transpile(line))
    print(f'>>> {line}')
    print(vy_print(stack, ctx=ctx))
    # print(pprint({}, stack))
    stack = []


def list_transform(out):
    out = out[1:-1] # remove outer brackets 
    out = out.replace('[', '(').replace(']', ')')
    out = out.replace(',', '')
    return out

# a = "[[2, 3, 4]]"
# print(pprint(a))
