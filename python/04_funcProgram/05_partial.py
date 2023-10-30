import functools
def int2(x): 
  return int(x, base = 2)

print(int2('1000000'))

# functools.partial is a function that can help us to create a new function


_int2 = functools.partial(int, base = 2)
print(_int2('1000000'))