class Student(object):
  def __init__(self, name, score):
    self.__name = name # __name 表示私有变量, 不能被外部访问
    self.__score = score 

  def print_score(self):
    print('%s: %s' % (self.__name, self.__score))

  def get_name(self):
    return self.__name
  
  def set_score(self, score):
    if 0 <= score <= 100:
      self.__score = score
    else:
      raise ValueError('bad score')

LiHua = Student('LiHua', 99)

# print(LiHua.__score) # AttributeError: 'Student' object has no attribute '__score'
print(LiHua.get_name()) # LiHua
LiHua.set_score(100)

# 虽然不能直接访问 __name, 但是可以通过 _Student__name 来访问
print(LiHua._Student__name) # LiHua