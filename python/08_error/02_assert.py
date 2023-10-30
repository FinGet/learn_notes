def foo(s):
  n = int(s)
  if n == 0:
    print('n is zero')
    return
  return 10 / n

foo('0')

# 断言
def foo1(s):
  n = int(s)
  assert n != 0, 'n is zero!'
  return 10 / n

# foo1('0')

# python -O 02_assert.py 可以关闭断言 

# logging
import logging

logging.basicConfig(level=logging.INFO) # 记录信息级别

def foo2(s):
  n = int(s)
  logging.info('n = %d' % n)
  return 10 / n

foo2('0')