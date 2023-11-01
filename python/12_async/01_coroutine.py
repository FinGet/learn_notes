def consumer():
  r = ''
  while True:
    n = yield r # yield r是将r返回给外部调用程序，交出控制权；n = yield 可以接收外部程序通过send发送的值，赋值给n
    if not n:
      return
    print('[CONSUMER] Consuming %s...' % n)
    r = '200 OK' # 这里的r是给produce的

def produce(c):
  c.send(None) # 启动生成器
  n = 0
  while n < 5:
    n = n + 1
    print('[PRODUCER] Producing %s...' % n)
    r = c.send(n) # 切换到consumer执行
    print('[PRODUCER] Consumer return: %s' % r)
  c.close() # 关闭consumer

c = consumer()

produce(c)