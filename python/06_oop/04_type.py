print(type(123)) # <class 'int'>
print(type('123')) # <class 'str'>
print(type(None)) # <class 'NoneType'>
print(type(abs)) # <class 'builtin_function_or_method'>

print(type(123) == type(456)) # True

import types

def fn():
  pass
print(type(fn))
print(type(fn) == types.FunctionType) # True
print(type(abs) == types.BuiltinFunctionType) # True
print(type(lambda x: x) == types.LambdaType) # True
print(type((x for x in range(10))) == types.GeneratorType) # True

print(isinstance('a', str)) # True
print(isinstance(123, int)) # True
print(isinstance(b'a', bytes)) # True

print(isinstance([1, 2, 3], (list, tuple))) # True

# dir() 获取一个对象的所有属性和方法

print(dir('ABC')) 

print(len('ABC')) # 3 实际上是调用了 'ABC'.__len__()
print('ABC'.__len__()) # 3

class MyDog(object):
  def __len__(self):
    return 100
  
dog = MyDog()
print(len(dog)) # 100

print('ABC'.lower()) # abc
print('ABC'.upper()) # ABC

class MyObject(object):
  def __init__(self):
    self.x = 9
  def power(self):
    return self.x * self.x
  
obj = MyObject()

print(hasattr(obj, 'x')) # True
print(hasattr(obj, 'y')) # False
setattr(obj, 'y', 19)
print(hasattr(obj, 'y')) # True

print(getattr(obj, 'y')) # 19
# 如果属性不存在, 返回默认值
print(getattr(obj, 'z', 404)) # 404 