class A:
    def __str__(self):
        return "aaa"
    def __repr__(self):
        return "gotcha"

a = A()
print(a)