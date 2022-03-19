#!/usr/bin/env apl

queens←{                            ⍝ The N-queens problem.

    search←{                        ⍝ Search for all solutions.
        (⊂⍬)∊⍵:0⍴⊂⍬                 ⍝ stitched: abandon this branch.
        0=⍴⍵:rmdups ⍺               ⍝ all done: solution!
        (hd tl)←(⊃⍵)(1↓⍵)           ⍝ head 'n tail of remaining ranks.
        next←⍺∘,¨hd                 ⍝ possible next steps.
        rems←hd free¨⊂tl            ⍝ unchecked squares.
        ↑,/next ∇¨rems              ⍝ ... in following ranks.
    }

    cvex←(1+⍳⍵)×⊂¯1 0 1             ⍝ Checking vectors.

    free←{⍵~¨⍺+(⍴⍵)↑cvex}           ⍝ Unchecked squares.

    rmdups←{                        ⍝ Ignore duplicate solution.
        rots←{{⍒⍵}\4/⊂⍵}            ⍝ 4 rotations.
        refs←{{⍋⍵}\2/⊂⍵}            ⍝ 2 reflections.
        best←{(⊃⍋↑⍵)⊃⍵}             ⍝ best (=lowest) solution.
        all8←,↑refs¨rots ⍵          ⍝ all 8 orientations.
        (⍵≡best all8)⊃⍬(,⊂⍵)        ⍝ ignore if not best.
    }

    fmt←{                           ⍝ Format solution.
        chars←'·⍟'[(↑⍵)∘.=⍳⍺]       ⍝ char array of placed queens.
        expd←1↓,↑⍺⍴⊂0 1             ⍝ expansion mask.
        ↑¨↓↓expd\chars              ⍝ vector of char matrices.
    }

    squares←(⊂⍳⌈⍵÷2),1↓⍵⍴⊂⍳⍵        ⍝ initial squares

    ⍵ fmt ⍬ search squares          ⍝ all distinct solutions.
}

⎕←queens 5
