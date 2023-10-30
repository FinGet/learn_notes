# Encoding: utf-8
# list 列表
e = [1, 2, 3]
print(e)
print(type(e)) # <class 'list'>

e[0] = 4
print(e)
print(e[-1]) # -1 表示倒数第一个元素

# append()方法
e.append(4)
print(e)

# insert()方法 在指定位置插入元素
e.insert(0, 0)
print(e)

# pop()方法 删除末尾/指定位置的元素
e.pop()
e.pop(0)
print(e)

# len()方法 获取元素个数
print(len(e))


# tuple 元组 一旦初始化就不能修改
f = (1, 2, 3)
print(f)
print(type(f)) # <class 'tuple'>

# 只有一个元素的元组
g = (1,) # (1) 表示数学公式中的小括号，所以只有一个元素的元组必须加逗号
print(g)

# tuple不可变，但是tuple中的list可变
h = (1, 2, [3, 4])
print(h)
h[2][0] = 5
h[2][1] = 6
print(h)