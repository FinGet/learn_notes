h = {'name': 'zhangsan', 'age': 18}
print(h)
print(type(h)) # <class 'dict'>

# 获取dict中的值
print(h['name']) # zhangsan
print(h.get('name')) # zhangsan
print(h.get('name1')) # None

# 判断dict中是否存在某个key
print('name' in h) # True

# 删除dict中的某个key
h.pop('name')

# 增加dict中的某个key
h['name'] = 'lisi'
print(h)

# 遍历dict中的key
for key in h.keys():
  print(key)


# set 无序不重复集合
g = {1, 2, 3}
print(g)
print(type(g)) # <class 'set'>

s = set([1, 1, 2, 3, 3]) # 重复元素在set中自动被过滤
print(s)

# 增加set中的元素
s.add(4) 
print(s)

# 删除set中的元素
s.remove(4)

# set可以看成数学意义上的无序和无重复元素的集合
s1 = set([1, 2, 3])
s2 = set([2, 3, 4])

print(s1 & s2) # 交集 {2, 3}