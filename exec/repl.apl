∇res ← repl
    :While 1
        in←⎕
        :If in='→'
            :Leave
        :Else
            input←⎕JSON in
            ⎕←input format⍕⍺⍺{               ⍝ print
                0::'Eh?'        ⍝   catching all errors
                ⍺⍺ ⍵            ⍝ eval
            }input.code               ⍝   of expr
        :EndIf
    :EndWhile
∇