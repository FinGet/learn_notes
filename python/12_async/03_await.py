import asyncio
import threading

async def hello():
  print('Hello world! (%s)' % threading.currentThread())
  await asyncio.sleep(1)
  print('Hello again! (%s)' % threading.currentThread())

loop = asyncio.get_event_loop()

loop.run_until_complete(hello())

tasks = [hello(), hello()]
  
loop.run_until_complete(asyncio.wait(tasks))
  
loop.close()

# 使用 async def 定义的函数是一个协程，它内部可以使用 await, return, yield 等语句。

# 使用 await 或 return 创建一个 coroutine 对象, 要调用 coroutine 函数，必须使用 await；

# 很少情况下会在 async 的函数中使用 yield，如果使用了，那么它的返回值必须是一个 coroutine 对象；

# 任何async def 内部都不能使用 yield from 语句，yield from 只能在 async def 函数外部使用；

# await 也不能在普通函数中使用

# async def f(x) :
#     y = await z(x)   # OK - `await` and `return` allowed in coroutines
#     return y

# async def g(x) :
#     yield x  # OK - this is an async generator

# async def m(x) :
#     yield from gen(x)   # No - SyntaxError

# def m(x) :
#     y = await z(x)   # Still no - SyntaxError (no `async def` here) 
#     return y