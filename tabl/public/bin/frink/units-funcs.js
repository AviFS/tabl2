[

`
Fahrenheit[x] := 
{ 
   if (x conforms K)  // If x is already a temperature, convert to F
      return ((x - zerocelsius) / K) * 9/5 + 32 
   else
      if (x conforms 1) // If x is a pure number, treat as Fahrenheit degrees
         return ((x-32) * 5/9) K + zerocelsius
      else
         return "Error"
}
`,

`
Richter[n] :=
{
   if (n conforms 1)             // Passed in dimensionless.  (Richter number)
      return 22387 e^(3.45388 n) J  // Convert to energy.

   if (n conforms joule)        // Passed in energy.  Convert to Richter.
      return -2.9 + 0.28953 ln[n/J]

   return "Error:  Richter[$n] expected dimensionless number or unit with dimensions of energy."
}
`,

`
DMS[d,m=0,s=0] :=
{
   if d<0 degrees
      -(-d degrees + m arcmin + s arcsec)
   else
      d degrees + m arcmin + s arcsec
}
`,


`
DMS[angle] := 
{
   if (angle > 0 degrees)
      angle -> ["degrees", "arcmin", "arcsec"]
   else
      "-" + DMS[-angle]
}
`,


`
DM[angle] := 
{
   if (angle > 0 degrees)
      angle -> ["degrees", "arcmin"]
   else
      "-" + DM[-angle]
}
`,

`
HMS[h,m=0,s=0] :=
{
   if h<0
      -(-h hours + m min + s sec)
   else
      h hours + m min + s sec
}
`,

`
DHMS[d,h=0,m=0,s=0] :=
{
   if d<0
      -(-d days + h hours + m min + s sec)
   else
      d days + h hours + m min + s sec
}
`,

`
HMS[time] := 
{
   if time > 0 hours
      time -> ["hours", "min", "sec"]
   else
      "-" + HMS[-time]
}
`,

`
DHMS[time] := 
{
   if time > 0 days
      time -> [0, "days", "hours", "min", "sec", 0]
   else
      "-" + DHMS[-time]
}
`

]