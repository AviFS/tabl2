trim←{⍵/⍨(∨\∧∘⌽∨\∘⌽)' '≠⍵}
flatten←{⍕↓⍣{2>⍴⍴⍵}⍵}
eval←{⍕ trim ⍎⍵}

outjson←'{"line": 0, "disp": "", "isError": false, "console": {}}'

∇ main
⎕PW←32767 ⍝ This was suchhhh a pain. And it's still a hacky solution.
:While 1<3
    output←⎕JSON outjson
    :Trap 0 ⍝ Catch issues with JSON at top level
        input←⎕JSON ⍞
        _ ← input.line input.code
        :If input.code≢''
            :Trap 0
                output.disp←eval input.code
                output.console.error←''
                output.isError←⊂'false'
            :Else
                output.console.error←⎕EM ⎕EN
                output.disp←''
                output.isError←⊂'true'
            :EndTrap
        :Else
            output.isError←⊂'true'
            output.error←'SERVER: Received empty code value.'
        :EndIf
        output.line←input.line
    :Else
        output.isError←⊂'true'
        output.error←'SERVER: JSON is invalid or missing required keys.'
    :EndTrap
    ⎕←⎕JSON output
    ⍝⍝⍝ ⎕←(⎕JSON⍠'HighRank' 'Split') output
    ⍝⍝⍝ ⎕←(⎕JSON⍠ 'Compact' 1) output ⍝⍝⍝
:EndWhile
∇
main
