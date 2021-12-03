const fs = require('fs');


// 将一个异步的方法，包装成promise；针对node 的api，因为要知道 异步方法的执行规则
const promisify = (fn) => (...args) => new Promise((resolve, reject) => {
  fn(...args, function(err, data) {
    if(err) reject(err);
    resolve(data)
  })
})

let read = promisify(fs.readFile)

read('./name.txt', 'utf8').then(res => {
  console.log(res)
})