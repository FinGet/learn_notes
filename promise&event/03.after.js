const fs = require('fs');
// 多个异步请求 如何同时获取最终结果？

// 1. 通过回调函数来实现
let index = 0;
const userInfo = {};
const cb = () => {
  index++;
  if(index === 2) {
    console.log(userInfo);
  }
}

// 2. after 高阶函数
function after(times, fn) {
  let res = {}
  return function(key, val) { // 闭包函数
    res[key] = val;
    if(--times === 0) {
      fn(res)
    }
  }
}

const newFn = after(2, (data) => {
  console.log(data)
})


fs.readFile('name.txt', 'utf8', function (err, data) {
  newFn('name', data);
  userInfo.name = data
  cb();
});

fs.readFile('age.txt', 'utf8', function (err, data) {
  newFn('age', data);
  userInfo.age = data;
  cb();
});