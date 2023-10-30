# 动态语言可以动态添加属性

from types import MethodType

class Student(object):
    pass

s = Student()

# 动态给实例绑定一个属性
s.name = 'Michael'

print(s.name)

# 动态给实例绑定一个方法
def set_age(self, age):
    self.age = age

s.set_age = MethodType(set_age, s)
# s.set_age = set_age
s.set_age(25)
print(s.age)

# 给类绑定方法
def set_score(self, score):
    self.score = score

Student.set_score = set_score 

s.set_score(100)

# 通过__slots__限制实例的属性

class Student(object):
  __slots__ = ('name', 'age') # 用tuple定义允许绑定的属性名称

s = Student()
s.name = 'Michael'
s.age = 25
# s.score = 100 # AttributeError: 'Student' object has no attribute 'score'