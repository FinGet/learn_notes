class Observe {
  constructor(data) {
    this.observe(data);
  }
  /**
   * 劫持
   * @param  {[type]} data [数据]
   * @return {[type]}      [description]
   */
  observe(data) { // data => object
    if (!data || this.getType(data) !== 'Object') {
      console.error('data Expected object, got ' + this.getType(data));
      return;
    }
    let keys = Object.keys(data);

    keys.forEach(key => {
      // 劫持
      if(this.getType(data[key]) === 'Object') {
      	this.observe(data[key]) // 深度劫持
      }
      this.defineReactive(data, key, data[key]);
    })
  }
  /**
   * 获取数据类型
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  getType(data) {
    return Object.prototype.toString.call(data).slice(8, -1);
  }

  /**
   * 定义响应式
   * @param  {[type]} obj          [对象]
   * @param  {[type]} key          [key]
   * @param  {[type]} val          [value]
   * @param  {[type]} customSetter [自定义setter]
   * @return {[type]}              [description]
   */
  defineReactive(obj, key, val, customSetter) {
  	let that = this;
  	let dep = new Dep;
    // 获取该属性的信息，判断能不能配置，不能配置直接返回
    let property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }

    // 获取该属性的get 和 set 方法（用户自己配置的）
    let getter = property && property.get;
    let setter = property && property.set;
    if ((!getter || setter) && arguments.length === 2) {
      val = obj[key];
    }

    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter() {
        // 如果用户配置了get 就调用它
        let value = getter ? getter.call(obj) : val;

        // 这是作依赖监听
        if (Dep.target) {
          dep.addSub(Dep.target);
        }
        return value
      },
      set: function reactiveSetter(newVal) {
        // 如果用户配置了set 就调用它
        let value = getter ? getter.call(obj) : val;
        /* eslint-disable no-self-compare */
        	
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        //  可以自定义传入一个setter
        if (customSetter) {
          customSetter();
        }
        // #7981: for accessor properties without setter
        if (getter && !setter) { return }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        if(that.getType(newVal) == 'Object') {
          that.observe(newVal)
        }
        // 值改变了，就出发observe(watcher)，更新视图
        dep.notify();
      }
    });
  }
}

/**
 * 发布-订阅
 */
class Dep {
	constructor() {
		// 订阅的数组
		this.subs = [];
	}
	addSub(watcher) {
		this.subs.push(watcher)
	}
	notify() {
		this.subs.forEach(watcher => watcher.update())
	}
}