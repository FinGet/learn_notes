from typing import Iterable


L = list(range(5))

for l in L:
  print(l)

for i, l in enumerate(L): # enumerate 把list变成索引-元素对
  print(i, l)

isinstance('abc', Iterable) # str是否可迭代
isinstance([1,2,3], Iterable) # list是否可迭代
isinstance(123, Iterable) # 整数是否可迭代

for x,y in [(1,1),(2,4),(3,9)]:
  print(x,y)