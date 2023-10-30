class Animal(object):
  def __init__(self, name):
    self.name = name

  def run(self):
    print('Animal is running...')

class Dog(Animal): # 继承
  def run(self): # 多态
    print('Dog %s is running...' % self.name)


boniu = Dog('波妞')
boniu.run() # Dog 波妞 is running...

print(isinstance(boniu, Animal)) # True