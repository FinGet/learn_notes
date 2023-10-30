a = 1
print(a)
print(type(a)) # <class 'int'>

a = 1.1
print(a)
print(type(a)) # <class 'float'>

b = '1'
print(b)
print(type(b)) # <class 'str'>

c = True
print(c)
print(type(c)) # <class 'bool'>

d = None
print(d)
print(type(d)) # <class 'NoneType'>


s1 = 'Hello, world'
s2 = 'Hello, \'Adam\'' # \ 转义
s3 = r'Hello, "Bart"' # r''表示''内部的字符串默认不转义
s4 = r'''Hello, 

Lisa!''' # r'''...'''的格式表示多行内容

print(s1)
print(s2)
print(s3)
print(s4)

n1 = 10 / 3 # 除法
n2 = 10 // 3 # 地板除 3 只保留整数部分
n3 = 10 % 3 # 取余 1 只保留余数部分

print(n1, n2, n3)