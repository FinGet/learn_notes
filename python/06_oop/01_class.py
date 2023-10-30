class Student(object): # (object) 表示该类是从哪个类继承下来的, object 是所有类最终都会继承的类
    def __init__(self, name, score): # __init__ 方法的第一个参数永远是self, 表示创建的实例本身
        self.name = name
        self.score = score

    def print_score(self): # self is the first argument of a method
        print('%s: %s' % (self.name, self.score))

    def get_grade(self):
        if self.score >= 90:
            return 'A'
        elif self.score >= 60:
            return 'B'
        else: 
            return 'C'


LiHua = Student('LiHua', 99)

print(LiHua) # <__main__.Student object at 0x7f9b1c0b6a90>

LiHua.print_score() # LiHua: 99
LiHua.get_grade() # 'A'