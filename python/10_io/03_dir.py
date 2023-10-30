import os

print(os.name) # 操作系统类型

print(os.uname()) # windows不提供

print(os.environ) # 环境变量

print(os.environ.get('PATH')) # 获取某个环境变量的值

print(os.path.abspath('.')) # 查看当前目录的绝对路径

os.mkdir('./testdir') # 创建一个目录

# os.rmdir('./testdir') # 删除一个目录

print(os.path.split('./testdir/file.txt')) # 拆分路径

print(os.path.splitext('./testdir/file.txt')) # 拆分扩展名

# os.rename('test.txt', 'test.py') # 重命名
# os.remove('test.py') # 删除文件

# 列出当前目录下的所有目录
print([x for x in os.listdir('.') if os.path.isdir(x)])