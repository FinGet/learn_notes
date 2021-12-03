const Promise = require('./promise')

// finally 表示不是最终的意思 而是无论如何都会执行的意思

/*
Promise.prototype.finally = function(callback) {
  return this.then(() => {
    callback()
  }, () => {
    callback()
  })
}
*./
/**
 * 1. 接收一个参数（是一个函数），返回的也是一个promise
 *  2. 前一个promise返回的是成功还是失败都会执行
 *  3. 当前这个finally返回普通值
 *    1). 上一个promise返回的是成功，则会把上一个的成功结果返回给下一个then的成功回调
 *    2). 上一个promise返回的是失败，则会把上一个的失败结果返回给下一个then的失败回调
 *  4. 当前这个finally返回的是promise
 *    1). 上一个promise返回的是成功，当前这个finally返回的是promise也是成功，则在finally中promise的then方法的成功回调中把上一个的成功结果返回给下一个then的成功回调
 *   2). 上一个promise返回的是成功，当前这个finally返回的是promise是失败，则会把finally中promise的then方法的失败回调中抛出（throw）当前的错误
 *   3). 上一个promise返回的是失败，当前这个finally返回的是promise是成功，则在finally中promise的then方法的成功回调中把上一个的失败结果抛出（throw）给下一个then的失败回调
 *   4). 上一个promise返回的是失败，当前这个finally返回的是promise也是失败，则在finally中promise的then方法的失败回调中把当前的失败结果抛出（throw）给下一个then的失败回调
 */
// Promise.resolve(123).finally(() => {
//   console.log('finally')
// })

let p1 = new Promise(function (resolve, reject) {
  reject(1);
});

p1.finally(function (data) {
  console.log(data, 'finally');
  return new Promise(function (resolve, reject) {
    resolve(2);
  });
})
  .then(
    (res) => {
      console.log(res, '下一个success');
    },
    (err) => {
      console.log(err, '下一个error');
    }
  )
  .catch((err) => {
    console.log(err);
  });