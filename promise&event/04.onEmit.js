// 发布 订阅模式
// on 就是把一些函数维护到一个数组中
// emit 就是让数组中的方法依次执行

const fs = require('fs');

let event = {
  arr: [],
  on(fn) {
    this.arr.push(fn)
  },
  emit() {
    this.arr.forEach((fn) => fn());
  }
}
const userInfo = {};
event.on(() => {
  if(Object.keys(userInfo).length === 2) {
    console.log(userInfo)
  }
})

fs.readFile('name.txt', 'utf8', function (err, data) {
  userInfo.name = data;
  event.emit()
});

fs.readFile('age.txt', 'utf8', function (err, data) {
  userInfo.age = data;
  event.emit()
});