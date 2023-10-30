if __name__ == '__main__':
  print('This is a module.')
else:
  print('This is a package.')

# __init__.py 作用:
# 1. 使得目录下的.py文件可以被import
# 2. 会在第一次import时被执行