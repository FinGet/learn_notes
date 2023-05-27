class A {
  static a = 1;
  b = 2;
  fn() {console.log('fn')}
  f = () => {console.log('f')};
}

const a = new A()

console.log(a.a)
console.log(a.b)
a.fn()
a.f()

// 单例模式

class Single {
  static instance = null;
  constructor(name) {
    if(!Single.instance) {
      this.name = name;
      Single.instance = this;
      return this;
    }
    return Single.instance;
  }

  getName() {
    return this.name;
  }
}

const singleA = new Single('a');
const singleB = new Single('b');

console.log(singleA.getName())
console.log(singleB.getName())
console.log(singleA === singleB)

// 代理模式实现
class Single2 {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

let instance = null;
function createSingle(name) {
  if(!instance) {
    instance = new Single2(name);
  }
  return instance;
}

const singleC = createSingle('c');
const singleD = createSingle('d');

console.log(singleC.getName())
console.log(singleD.getName())
console.log(singleC === singleD)