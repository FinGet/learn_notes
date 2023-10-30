def enroll(name, gender, age = 6, city = 'chengdu'):
  print('name:', name)
  print('gender:', gender)
  print('age:', age)
  print('city:', city)

enroll('zhangsan', 'M')

enroll('lisi', 'F', 7)

enroll('wangwu', 'M', city = 'beijing') # 传入参数时，可以不按照顺序，但是要指定参数名

# 默认参数必须指向不变对象

def add_end(L = []):
  L.append('end')
  return L

print(add_end([1, 2, 3]))
print(add_end(['x', 'y', 'z']))

print(add_end()) # ['end']
print(add_end()) # ['end', 'end'] 参数L的默认值是[]，但是函数似乎每次都“记住了”上次添加了'END'后的list

# 原因解释如下：
# Python函数在定义的时候，默认参数L的值就被计算出来了，即[]，因为默认参数L也是一个变量，它指向对象[]，
# 每次调用该函数，如果改变了L的内容，则下次调用时，默认参数的内容就变了，不再是函数定义时的[]了。

# 定义默认参数要牢记一点：默认参数必须指向不变对象！

def add_end(L = None):
  if L is None:
    L = []
  L.append('end')
  return L

print(add_end()) # ['end']
print(add_end()) # ['end']

# 可变参数

def calc(*numbers): # 在参数前面加一个*号，表示可变参数
  # *numbers is a tuple
  sum = 0
  for n in numbers:
    sum = sum + n * n
  return sum

print(calc(1, 2, 3)) # 14

nums = [1, 2, 3]
print(calc(nums[0], nums[1], nums[2])) # 14
# 🚩在list或tuple前面加一个*号，表示将list或tuple的元素变成可变参数传进去
print(calc(*nums)) # 14 


# 关键字参数

def person(name, age, **kw): # 在参数前面加两个*号，表示关键字参数
  # **kw is a dict
  print('name:', name, 'age:', age, 'other:', kw)

person('zhangsan', 18) # name: zhangsan age: 18 other: {}

extra = {'city': 'chengdu', 'job': 'engineer'}
# 🚩在dict前面加两个*号，表示将dict的元素变成关键字参数传进去
person('lisi', 20, **extra) # name: lisi age: 20 other: {'city': 'chengdu', 'job': 'engineer'}

# 命名关键字参数
def person(name, age, **kw):
    if 'city' in kw:
        # 有city参数
        pass
    if 'job' in kw:
        # 有job参数
        pass
    print('name:', name, 'age:', age, 'other:', kw)

# 🚩如果要限制关键字参数的名字，就可以用命名关键字参数
# 命名关键字参数需要一个特殊分隔符*，*后面的参数被视为命名关键字参数
def person(name, age, *, city, job):
  print(name, age, city, job)

person('zhangsan', 18, city = 'chengdu', job = 'engineer') # zhangsan 18 chengdu engineer


# 参数组合

# 参数定义的顺序必须是：必选参数、默认参数、可变参数和关键字参数。

def f1(a, b, c = 0, *args, **kw):
  print('a =', a, 'b =', b, 'c =', c, 'args =', args, 'kw =', kw)

def f2(a, b, c = 0, *, d, **kw):
  print('a =', a, 'b =', b, 'c =', c, 'd =', d, 'kw =', kw)

f1(1, 2) # a = 1 b = 2 c = 0 args = () kw = {}

f1(1, 2, c = 3) # a = 1 b = 2 c = 3 args = () kw = {}

f2(1, 2, 3, d = 4, ext = None) # a = 1 b = 2 c = 3 d = 4 kw = {'ext': None}

f2(1, 2, d = 4, ext = None) # a = 1 b = 2 c = 0 d = 4 kw = {'ext': None}

# 🚩通过一个tuple和dict，你也可以调用上述函数
args = (1, 2, 3, 4)
kw = {'d': 99, 'x': '#'}
f1(*args, **kw) # a = 1 b = 2 c = 3 args = (4,) kw = {'d': 99, 'x': '#'}

args = (1, 2, 3)
kw = {'d': 88, 'x': '#'}
f2(*args, **kw) # a = 1 b = 2 c = 3 d = 88 kw = {'x': '#'}

# 递归函数

def fact(n):
  if n == 1:
    return 1
  return n * fact(n - 1)

print(fact(5)) # 120