f = open('/Users/zhangbiao/Desktop/learn_notes/python/10_io/1.txt', 'r')

print(f.read())

f.close()

try: 
  f = open('/Users/zhangbiao/Desktop/learn_notes/python/10_io/1.txt', 'r')
  print(f.read())
finally:
  if f:
    f.close()

# with语句自动调用close()方法
with open('/Users/zhangbiao/Desktop/learn_notes/python/10_io/1.txt', 'r') as f:
  print(f.read())

# read(size)方法，每次最多读取size个字节的内容
# readline()方法，每次读取一行内容
# readlines()方法，一次读取所有内容并按行返回list

# 二进制文件 rb
with open('/Users/zhangbiao/Desktop/learn_notes/python/10_io/1.png', 'rb') as f:
  print(f.read())

# 字符编码
with open('/Users/zhangbiao/Desktop/learn_notes/python/10_io/1.txt', 'r', encoding='gbk') as f:
  print(f.read())

# 遇到编码错误，open()函数还接收一个errors参数，表示如果遇到编码错误后如何处理
with open('/Users/zhangbiao/Desktop/learn_notes/python/10_io/1.txt', 'r', encoding='gbk', errors='ignore') as f:
  print(f.read())

# 写文件 w write
with open('/Users/zhangbiao/Desktop/learn_notes/python/10_io/2.txt', 'w') as f:
  f.write('Hello, world222!')

# 追加写入 a append
with open('/Users/zhangbiao/Desktop/learn_notes/python/10_io/2.txt', 'a') as f:
  f.write('Hello, world333!')
