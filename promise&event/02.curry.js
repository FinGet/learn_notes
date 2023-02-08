// 函数柯理化，也是高阶函数的一种

// 判断变量的类型
// 1.typeof 不能判断对象类型
// 2.constructor 可以找到这个变量是通过谁构造出来的
// 3.instanceof 判断谁是谁的实例
// 4.Object.prototype.toString.call(target) 不能细分谁是谁的实例

function isType(type, str) {
  return Object.prototype.toString.call(str) == `[object ${type}]`;
}

// 能不能将方法细分 isType => isString isArray
// function isType(type) {
//   return function (val) {
//     return Object.prototype.toString.call(val) == `[object ${type}]`;
//   };
// }
// 具体的方法 isNumber,isString
let utils = {};
// ['String', 'Number', 'Boolean'].forEach((item) => {
//   utils['is' + item] = isType(item);
// });

// console.log(utils.isString('123'));
// console.log(utils.isNumber(22));


// 一般不会想到isType这种柯里化写法，能不能通过一个函数 自动帮我实现
// 函数分步传递参数，将函数拆分成功能更具体化的函数

// 柯里化的特点
// 1.参数复用 - 如果是相同的参数，在计算之后不需要再次计算
// 2.提前返回 - 多次调用多次内部判断，可以直接把一次调用结果返回
// 3.延迟执行 - 避免重复的去执行程序，等真正需要结果的时候，再执行，思路把所有参数都存起来，不传参数才执行

const curry = (fn,args=[]) => {
  let len = fn.length; // 函数参数的长度
  return (..._) => {
    let arg = args.concat(_);
    console.log(arg, args)
    if(arg.length < len){
      return curry(fn,arg);
    }
    return fn(...arg);
  }
}

function sum(a,b,c,d,e) {
  return a + b + c + d + e
}

const currySum = curry(sum);
console.log(currySum(1,2)(3)(4,5));

['String','Number','Boolean'].forEach(type=>{
  utils[`is${type}`] = curry(isType)(type);
})
console.log(utils.isString)
console.log(utils.isString(111));
console.log(utils.isNumber(22));
console.log(utils.isBoolean(false));

