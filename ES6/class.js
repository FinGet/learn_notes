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