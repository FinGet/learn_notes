const fs = require('fs');
const Promise = require('./promise')

// 延迟对象
// 不用一开始就在readFile包装一层 new Promise
// 使用时 最后 return dfd.promise 一样可以实现异步调用
Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise(function (resolve, reject) {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

function read(path) {
  let dfd = Promise.deferred();
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) dfd.reject(err);
    dfd.resolve(data);
  });
  return dfd.promise;
}

read('./name.txt').then((res) => {
  console.log(res);
});
