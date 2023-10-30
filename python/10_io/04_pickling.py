# 序列化

import pickle

d = dict(name='Bob', age=20, score=88)

print(pickle.dumps(d)) # 序列化

f = open('dump.txt', 'wb') # 写入文件

pickle.dump(d, f) # 序列化

f.close()

f = open('dump.txt', 'rb') # 读取文件

d = pickle.load(f) # 反序列化

f.close()

print(d)

# JSON

import json

d = dict(name='Bob', age=20, score=88)

print(json.dumps(d)) # 序列化

json_str = '{"age": 20, "score": 88, "name": "Bob"}'

print(json.loads(json_str)) # 反序列化


# JSON进阶

class Student(object):
  def __init__(self, name, age, score):
    self.name = name
    self.age = age
    self.score = score

s = Student('Bob', 20, 88)

# print(json.dumps(s)) # TypeError: Object of type Student is not JSON serializable

def student2dict(std):
  return {
    'name': std.name,
    'age': std.age,
    'score': std.score
  }

print(json.dumps(s, default=student2dict)) # 序列化

# but, 这样写太麻烦，可以用__dict__属性，把任意class的实例变为dict
print(json.dumps(s, default=lambda obj: obj.__dict__)) # 序列化