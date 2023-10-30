age = input('please input your age: ') # input()返回的数据类型是str
age = int(age)
if age >= 18:
    print('your age is', age)
    print('adult')
elif age >= 6:
    print('your age is', age)
    print('teenager')
else: 
    print('your age is', age)
    print('teenager')


# match

score = 'B'
match score: # 3.10 新增的match语法
    case 'A':
        print('85 ~ 100')
    case 'B':
        print('60 ~ 85')
    case 'C': 
        print('< 60')
    case _: # case _ 表示匹配所有情况
        print('error')
