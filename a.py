try:
    import __builtin__
except ImportError:
    # Python 3
    import builtins as __builtin__

import sys

_print = __builtin__.print



def output(out="", err=""):
   return f'{{ "stdout": "{out}", "stderr": "{err}" }}'

def base(*args, **kwargs):
    sep = " "
    end = "\\n"

    result = sep.join([str(arg) for arg in args]) + end

    data = output(out=result)
    _print(data)

def print(*args, **kwargs):
    return base(*args, **kwargs)

    # _print(*args, sep=sep, file=file, end=end)

# def print(*args, **kwargs):
#     """My custom print() function."""

#     def output(out="", err=""):
#         kwargs['file'] = sys.stdout
#         # __builtin__.print(f'{{ "stdout": "{out}", "stderr": "{err}" }}')


#     # Adding new arguments to the print function signature 
#     # is probably a bad idea.
#     # Instead consider testing if custom argument keywords
#     # are present in kwargs

#     file = kwargs.get('file', '')
#     # _print(kwargs)

#     if (file == ''):  
#         output(out=' '.join(args))

#     if (file == sys.stderr):
#         output(err=' '.join(args))
#     elif (file == sys.stdout): 
#         output(out=' '.join(args))

print("lsfj")
print("lskjfj",3, 4,file=sys.stderr)