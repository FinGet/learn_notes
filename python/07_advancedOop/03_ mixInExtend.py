# 多重继承

class Animal(object):
  pass

class Mammal(Animal):
  pass

class Bird(Animal):
  pass

# 大类:
class Runnable(object):
  def run(self):
    print('Running...')

class Flyable(object):
  def fly(self):
    print('Flying...')

# 各种动物:

class Dog(Mammal, Runnable):
  pass

class Bat(Mammal, Flyable):
  pass

class Parrot(Bird, Flyable):
  pass

dog = Dog()
dog.run()

bat = Bat()
bat.fly()

