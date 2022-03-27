#!/usr/bin/env bash

cat > "bf.c" << EOF
#define LIM 10
#include <stdint.h>
#include <stdio.h>
int main(){
uint8_t t[65536] = {0};
uint16_t p = 0;
int i;
EOF

while read -n1 char; do
	case "$char" in
		\>) echo '++p;';;
		\<) echo '--p;';;
		\+) echo '++t[p];';;
		\-) echo '--t[p];';;
		\,) echo 'i=getchar(),t[p]=i*(i>0);';;
		\.) echo 'putchar(t[p]);';;
		\[) echo 'while(t[p]){';;
		\]) echo '}';;
        \#) echo 'for(int i=0; i<LIM; i++) {printf((p==i)? "  %3d*": "  %3d ", t[i]);} putchar(10);';;
	esac
done < /dev/stdin >> "bf.c"

echo 'return 0;}' >> "bf.c"

cc -O3 -o "bf.out" "bf.c" && "./bf.out"