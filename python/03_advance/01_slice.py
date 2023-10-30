L = ['Michael', 'Sarah', 'Tracy', 'Bob', 'Jack']

# 取前3个元素
r = []
n = 3
for i in range(n):
  r.append(L[i])

print(r) # ['Michael', 'Sarah', 'Tracy']

# 切片

print(L[0:3]) # ['Michael', 'Sarah', 'Tracy']
print(L[:3]) # ['Michael', 'Sarah', 'Tracy']
print(L[1:3]) # ['Sarah', 'Tracy']
print(L[-2:-1]) # ['Bob']
print(L[-2:]) # ['Bob', 'Jack']

L = list(range(100))

# 取前10个数
print(L[:10]) # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# 取后10个数
print(L[-10:]) # [90, 91, 92, 93, 94, 95, 96, 97, 98, 99]

# 前11-20个数
print(L[10:20]) # [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

# 前10个数，每两个取一个
print(L[:10:2]) # [0, 2, 4, 6, 8]

# 所有数，每5个取一个
print(L[::5])

# 复制一个list
print(L[:]) # [0, 1, 2, 3, ..., 99]

# tuple也是一种list，唯一区别是tuple不可变
print((0, 1, 2, 3, 4, 5)[:3]) # (0, 1, 2)

# 字符串'xxx'也可以看成是一种list，每个元素就是一个字符
print('ABCDEFG'[:3]) # ABC


def trim(s): 
  while s[:1] == ' ':
    s = s[1:]
  
  while s[-1:] == ' ':
    s = s[:-1]

  return s

print(trim('  hello  ')) # hello
print(trim('  hello')) # hello