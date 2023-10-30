names = ['Michael', 'Bob', 'Tracy']

for name in names:
  print(name)


# sum
sum = 0
for x in [1, 2, 3, 4, 5, 6, 7, 8, 9]:
  sum = sum + x
print(sum)

for x in range(101):
  sum = sum + x
print(sum)


# while

sum = 0
n = 99

while n > 0:
  sum = sum + n
  n = n -2

print(sum)

n = 1
while n <= 100:
  if n > 30: 
    break # break 语句会结束当前循环
  print(n)
  n = n + 10
print('END')

n = 0
while n < 10:
  n = n + 1
  if n % 2 == 0:
    continue # continue 会直接继续下一轮循环，后续的 print() 语句不会执行
  print(n)
print('END')