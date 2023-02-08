// 高阶函数 “满足两个之一”
// 1. 把函数当参数传递（callback）
// 2. 在函数内部返回一个函数（闭包）

// 装饰器模式：对原本的功能进行包装，也叫AOP（切片编程）
// AOP(面向切面编程)的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，
// 其实就是给原函数增加一层，不用管原函数内部实现

// 对原有的方法进行包装，不破坏原有功能，只是添加
function core(a, b) {
  console.log('code ...', a, b);
}
// 每个类都有一个原型，每个实例都有一个属性__proto__
Function.prototype.before = function (beforeFn) {
  /* const that = this;
  return function () {
    beforeFn();
    that();
  }; */
  return (...args) => { // 箭头函数没有this 也没有 arguments，没有原型
    beforeFn();
    this(...args);
  };
};

const newFn = core.before(function () {
  console.log('core before');
});

newFn(1, 2);


// 我们想在push之前做点什么事，我们可以改写数组的push方法，在不影响原有功能下能正常使用
// 这种也叫切片编程 vue2中的数组处理就是这种方式

let oldPushFun = Array.prototype.push;

 Array.prototype.push = function (...args) {
   console.log("新的数组方法");
   return oldPushFun.apply(this, args);
 }

let res = [1, 2].push(4);
console.log("res", res);
