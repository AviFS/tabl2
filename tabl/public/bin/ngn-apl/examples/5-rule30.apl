#!/usr/bin/env a
⍝ See https://en.wikipedia.org/wiki/Rule_30

r←30
n←50
t←⌽r⊤⍨8⍴2
⎕←' #'[↑⌽{⍵,⍨⊂t[2⊥¨3,/0,0,⍨⊃⍵]}⍣n⊂z,1,z←n⍴0]
