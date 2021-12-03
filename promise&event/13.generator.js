// generator 生成器 => 遍历器  == 数组 => 类数组

const likeArray = {0: 'a', 1: 'b', 2: 'c', 3: 'd', length: 4}

// ...原理就是遍历这个对象 将结果放到数组中，这个数据必须得有个遍历器
// const arr = [...likeArray] 
// object is not iterable (cannot read property Symbol(Symbol.iterator))
// console.log(arr)


// 给类数组提供一个遍历器
/**
likeArray[Symbol.iterator] = function() {
  let i = 0;
  return { // 遍历器就是一个对象 有next方法
    next: () => {
      return {value: this[i], done: i++ === this.length}
    }
  }
}
 */

// generator 语法
likeArray[Symbol.iterator] = function * () {
  let i = 0;
  while(i < this.length) {
    yield this[i++]
  }
}

console.log([...likeArray]) // [ 'a', 'b', 'c', 'd' ]

// 普通函数默认会从头到尾执行没有暂停功能
// generator函数，如果碰到yield 就会暂停执行; 一个遍历器对象生成函数

function * read() {
  yield 1;
  yield 2;
  yield 3;
  return undefined 
}

let it = read(); // it 就是迭代器，迭代器上有一个next方法

// console.dir(it.next()) // {value: 1, done: false}
// console.dir(it.next()) // {value: 2, done: false}
// console.dir(it.next()) // {value: 3, done: false}
// console.dir(it.next()) // {value: undefined, done: true}

let flag = false
do{
  let {value, done} = it.next()
  console.log(value)
  flag = done
}while(!flag)


  function *foo(x) {
    let y = 2 * (yield (x + 1))
    let z = yield (y / 3)
    return (x + y + z)
  }
  let fooit = foo(5)
  console.log(fooit.next())   // => {value: 6, done: false}
  console.log(fooit.next(12)) // => {value: 8, done: false}
  console.log(fooit.next(13)) // => {value: 42, done: true}

const fs = require('fs').promises
function * readFile() {
  let name = yield fs.readFile('name.txt', 'utf8')
  let age = yield fs.readFile(name, 'utf8')
  return age
}


const co = it => {
  return new Promise((resolve, reject) => {
    function next() {
      let {value, done} = it.next()
      if(!done) {
        Promise.resolve(value).then((data) => {
          it.next(data)
        }, reject)
      } else {
        resolve(value)
      }
    }
    next()
  })
}


co(readFile()).then(data => {
  console.log(data)
})


// 进一步优化 async await

async function readFile1() {
  let name = await fs.readFile('name.txt', 'utf8')
  let age = await fs.readFile(name, 'utf8')
  return age
}







