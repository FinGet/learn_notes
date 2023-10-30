def log(func):
  def wrapper(*args, **kw):
    print('args: %s, kw: %s' % (args, kw))
    print('call %s():' % func.__name__) 
    return func(*args, **kw)
  return wrapper

@log
def now(xx):
  print('2017-11-17', xx)

now({'name': 'finget'}) # call now():\n2017-11-17