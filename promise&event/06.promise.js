// promise的特点以及概念
// https://promisesaplus.com/ promiseA+规范

// promise es6 内部已经实现了, ie 以下不支持，需要polyfill es6-promise
// 解决的问题：
// 1. 解决异步并发问题（Promise.all）
// 2. 解决回调地狱问题（上一个输出是下一个的输入）
// 3. 错误处理比较方便
// 缺陷：依旧是基于回调函数，无法中断

// 1.promise 三要素： 等待态 成功态 失败态
/*
  用法要点：
    1. Promise是个构造函数，需要new来调用，传入一个函数 executor，这个函数会立即执行
    2. executor接收两个两个参数resolve, reject
    3. 默认创建一个promise，状态就是pending，fulfilled，rejected，
      默认是 pending （等待状态）
      成功的时候调用resolve()，传递一个成功的原因，状态就会变成 fulfilled
      失败的时候调用reject()，传递一个失败的原因，状态就会变成 rejected
      状态一旦改变（变成成功态或失败态），是不可逆
    4. 每个promise实例都有一个then，接收两个参数（onfulfilled, onrejected），成功的回调和失败的回调
    5. 如果发生异常，也会走 reject
    6. 同一个promise实例可以then多个（发布订阅模式）
    7. then可以链式调用，每次返回的新的返回promise（状态不可逆，因为要保证状态能修改，所以每次要返回一个新的promise）
      1). 如果then方法中（成功或失败）返回的不是一个promise，会将这个值传递到外层下一次的then的成功结果
      2). 如果then方法抛异常，就走到下一个then的失败回调里面
      3). 如果then方法返回的是一个promise，则这个promise的返回结果就决定下一个then的成功或失败
      只有两种情况会走下一个then失败的回调：1.出错了，异常；2. 返回的promise出错了
      其他情况都会走下一个then的成功回调
    8. 每次执行完promise.then方法后返回的都是一个“新的Promise"（因为promise的状态一旦成功或者失败就不能再改变了）
*/
let Promise = require('./promise')
// let promise = new Promise((resolve, reject) => {
//   resolve(1)
//   // reject(1)
// }).then(res => {
//   console.log(res)
// })

// console.log(promise) 
// Promise { <pending> }
// Promise { 1 }
// Promise { <rejected> 1 }

let fs = require('fs');

// error first 错误第一 异步方法无法通过try catch 捕获异常
fs.readFile('name.txt', 'utf8', function (err, data) {

});


// let readFilePromise = () => new Promise((resolve, reject) => {
//   fs.readFile('name.txt', 'utf8', function (err, data) {
//     if(err) {
//       reject(err)
//     }
//     resolve(data)
//   });
// })

// readFilePromise().then(data => {
//   console.log(data)
//   return data
// }).then(data => {
//   console.log(data)
// })


let p1 = new Promise((resolve, reject) => {
  // resolve(100)
  reject(100)
})
let p2 = p1.then((data) => {
  console.log(data)
  return 1
}, (err) => {
  console.log(err)
  return 400
})

p2.then(data => {
  console.log(data)
})

let p3 = p1.then((data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('ksjw')
    }, 1000)
  })
})

p3.then(data => {
  console.log(data); // 过一秒后打印ksjw
})