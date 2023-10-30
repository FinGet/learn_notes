L = list(range(1, 11))

print(L) # 1-10

L1 = [x * x for x in range(1, 11)]

print(L1) # 1-10的平方

L2 = [x * x for x in range(1, 11) if x % 2 == 0]
# for 前面是 一个表达式， 它必须根据x计算出一个结果

print(L2) # 1-10的平方，偶数

L3 = [m + n for m in 'ABC' for n in 'XYZ']
print(L3) # 两层循环，全排列


# for循环其实可以同时使用两个甚至多个变量，比如dict的items()可以同时迭代key和value：

d = {'x': 'A', 'y': 'B', 'z': 'C' }

for k, v in d.items():
  print(k, '=', v)