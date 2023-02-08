// 观察者模式 有观察者 肯定有被观察者
// 1. 观察者要放到被观察者中
// 2. 被观察者状态变化要通知观察者
// 3. 内部也是基于发布订阅

class Subject { // 被观察者  小宝宝
  constructor(name) {
    this.name = name;
    this.state = 'happy';
    this.observers = [];
  }
  attach(o) { // 收集观察者
    // 被观察者中要存放所有的观察者 (这句话应该说是需要监听被观察者的状态的观察者，不一定是所有的)
    this.observers.push(o);
  } 
  setState(newState) {
    if (this.state != newState) {
      this.state = newState;
      this.observers.forEach((o) => o.update(this));
    }
  }
}

class Observer { // 观察者  我 我媳妇
  constructor(name) {
    this.name = name;
  }
  update(baby) {
    console.log(baby.name + '跟' + this.name + '说' + baby.state);
  }
}

let baby = new Subject('小宝宝');
let o1 = new Observer('爸爸');
let o2 = new Observer('妈妈');

baby.attach(o1);
baby.attach(o2);


baby.setState('我不开心了');
