# 高级函数
# 1.函数名也是变量
# 2.函数也是参数
from functools import reduce
# map/reduce

def f(x):
  return x * x

r = map(f, [1,2,3,4,5,6,7,8,9]) 
# r 是一个Iterator，是惰性序列，通过list()函数让它把整个序列都计算出来并返回一个list
print(list(r))

def add(x,y):
  return x + y

print(reduce(add, [1,3,5,7,9]))

def fn(x,y):
  return x * 10 + y

print(reduce(fn, [1,3,5,7,9])) # 13579

# filter

def is_odd(n):
  return n % 2 == 1

print(list(filter(is_odd, [1,2,3,4,5,6,7,8,9])))

# sorted

print(sorted([36,5,-12,9,-21]))