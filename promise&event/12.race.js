//  中断Promise
// 注意这里是中断而不是终止，因为 Promise 无法终止，
// 这个中断的意思是：在合适的时候，把 pending 状态的 promise 给 reject 掉。
// 例如一个常见的应用场景就是希望给网络请求设置超时时间，一旦超时就就中断，
// 我们这里用定时器模拟一个网络请求，随机 3 秒之内返回：
const request = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('收到服务端数据')
  }, Math.random() * 3000)
})

//  如果认为超过 2 秒就是网络超时，可以对该 promise 写一个包装函数 timeoutWrapper：
function timeoutWrapper(p, timeout = 2000) {
  const wait = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('请求超时')
    }, timeout)
  })
  return Promise.race([p, wait])
}


// 中断调用链
// 就是在某个 then/catch 执行之后，不想让后续的链式调用继续执行了，即：
somePromise
  .then(() => {})
  .then(() => {
    // 终止 Promise 链，让下面的 then、catch 和 finally 都不执行
  })
  .then(() => console.log('then'))
  .catch(() => console.log('catch'))
  .finally(() => console.log('finally'))

// 答案就是在 then/catch 的最后一行返回一个永远 pending 的 promise 即可：

return new Promise((resolve, reject) => {})
// 复制代码这样的话后面所有的 then、catch 和 finally 都不会执行了。
