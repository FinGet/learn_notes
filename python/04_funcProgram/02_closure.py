def lazy_sum(*args):
  def sum():
    ax = 0
    for n in args:
      ax = ax + n
    return ax
  return sum

f = lazy_sum(1,3,5,7,9)

print(f) # <function lazy_sum.<locals>.sum at 0x7f8b1c0b2d90>
print(f()) # 25

# 闭包

def count():
  fs = []
  for i in range(1,4):
    def f():
      return i * i
    fs.append(f)
    print(fs)
  return fs

f1,f2,f3 = count()

print(f1()) # 9
print(f2()) # 9
print(f3()) # 9


def createCounter():
  n = 0
  def counter():
    nonlocal n # nonlocal关键字声明n是外部变量
    n = n + 1
    return n
  return counter