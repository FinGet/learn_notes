def build(x, y):
  return lambda: x * x + y * y

print(build(1,2)()) # 5

L = list(filter(lambda n: n % 2 == 1, range(1, 20)))
print(L) # [1,3,5,7,9,11,13,15,17,19]