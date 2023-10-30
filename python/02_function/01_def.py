
import math


print(max(1, 2, 3, 4, 5))
print(min(1, 2, 3, 4, 5))

print(abs(-99))
print(max(list(range(100))))

def my_abs(x):
  if x > 0:
    return x
  else: 
    return -x
  
print(my_abs(-99))


# 空函数
def pop():
  pass # pass 语句什么都不做，实际上 pass 可以用来作为占位符，比如现在还没想好怎么写函数的代码，就可以先放一个 pass，让代码能运行起来

# 参数检查

def my_abs(x):
  if not isinstance(x, (int, float)): # isinstance() 函数来判断一个变量是否是某个类型
    raise TypeError('bad operand type') # raise 语句抛出一个错误的实例
  if x > 0:
    return x
  else:
    return -x
  
print(my_abs('avc'))


# 返回多个值
def move(x, y, step, angle = 0):
  nx = x + step * angle
  ny = y - step * angle
  return nx, ny

x, y = move(100, 100, 60, math.pi / 6)