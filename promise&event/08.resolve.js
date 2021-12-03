const Promise = require('./promise')
// Promise.resolve 快速创建一个成功的promise
Promise.resolve(new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(100)
  },1000)
})).then(data => {
  console.log(data)
})

// Promise.reject 不支持接收一个promise，它会直接失败
Promise.reject(new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(100)
  },1000)
})).catch(err => {
  console.log(err)
})