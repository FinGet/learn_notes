# 在内存上读写

from io import StringIO

f = StringIO()

f.write('hello')

f.write(' ')

f.write('world!')

print(f.getvalue())


# 读取StringIO
f = StringIO('Hello!\nHi!\nGoodbye!')

while True:
  s = f.readline()
  if s == '':
    break
  print(s.strip())

# BytesIO 读取二进制数据
from io import BytesIO

f = BytesIO()

f.write('中文'.encode('utf-8')) # 写入的不是str，而是经过UTF-8编码的bytes 

print(f.getvalue())