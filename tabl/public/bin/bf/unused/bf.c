#define LIM 10
#include <stdint.h>
#include <stdio.h>
int main(){
uint8_t t[65536] = {0};
uint16_t p = 0;
int i;
--t[p];
--t[p];
--p;
--t[p];
--p;
--p;
++t[p];
while(t[p]){
++t[p];
while(t[p]){
--p;
++t[p];
++p;
--t[p];
--t[p];
--t[p];
++p;
--t[p];
++p;
--t[p];
++p;
--t[p];
--p;
--p;
--p;
}
++p;
}
--p;
--p;
--t[p];
--t[p];
putchar(t[p]);
--p;
++t[p];
++t[p];
++t[p];
++t[p];
++t[p];
++t[p];
putchar(t[p]);
--p;
--p;
--t[p];
putchar(t[p]);
putchar(t[p]);
--p;
--p;
putchar(t[p]);
--p;
++t[p];
putchar(t[p]);
++p;
++p;
putchar(t[p]);
++p;
++p;
putchar(t[p]);
--p;
--p;
--p;
putchar(t[p]);
++t[p];
++t[p];
++t[p];
putchar(t[p]);
++p;
++p;
putchar(t[p]);
while(t[p]){
++p;
++p;
--t[p];
putchar(t[p]);
--p;
--p;
--p;
++t[p];
putchar(t[p]);
return 0;}
