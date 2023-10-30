# 8bit = 1byte
# 1024byte = 1KB
# 1024KB = 1MB
# 1024MB = 1GB
# 1024GB = 1TB
# 1024TB = 1PB
# 1024PB = 1EB

# 由全英文的ASCII码编码，到全世界的Unicode编码，再到现在的可变长度UTF-8编码，字符编码的历史变迁，就是计算机发展的历史。
#字符 	 ASCII	       Unicode         	            UTF-8
#A	   01000001	   00000000 01000001	            01000001
#中	     x	     01001110 00101101	      11100100 10111000 10101101


# python3中的字符串是以Unicode编码的

str = '中文str'
print(str)

# ord()函数获取字符的整数表示
print(ord('A'))
print(ord('中'))

# chr()函数把编码转换为对应的字符
print(chr(66))
print(chr(25991))

# 如果知道字符的整数编码，还可以用十六进制这么写str
print('\u4e2d\u6587')

# len()函数计算str包含多少个字符
print(len('ABC'))
print(len('中文'))

# len()函数计算bytes包含多少个字节
print(len(b'ABC'))
print(len(b'\xe4\xb8\xad\xe6\x96\x87'))

# 以Unicode表示的str通过encode()方法可以编码为指定的bytes
print('ABC'.encode('ascii'))
print('中文'.encode('utf-8'))

# 模版字符串
print('Hello, %s' % 'world')
print('Hi, %s, you have $%d.' % ('Michael', 1000000))
print('%2d-%02d' % (3, 1)) # %2d 表示两位整数，不足两位前面补空格, %02d 表示两位整数，不足两位前面补0
print('%.2f' % 3.1415926) # .2f 保留两位小数
# %d 整数
# %f 浮点数
# %s 字符串
# %x 十六进制整数

# format()方法
print('Hello, {0}, 成绩提升了 {1:.1f}%'.format('小明', 17.125)) # :.1f 表示保留一位小数

# f-string
r = 2.5
s = 3.14 * r ** 2
print(f'The area of a circle with radius {r} is {s:.2f}')