import sys

def output(out='', err=''):
    print(f'{{"stdout": "{out}", "stderr": "{err}"}}')
    
def interp(inp):
    if "*" in inp:
        output(err="invalid asterisk")
    else:
        output(out=inp[::-1])

# if __name__ == "__main__":
while True:
    line = input()
    interp(line.strip('\n'))

    # for i in range(5):
    #     print(f"sfj{i}")