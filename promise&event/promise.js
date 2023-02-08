// 三种状态
const PENDING = 'PENDING'; // 等待态
const FULFILLED = 'FULFILLED'; // 成功态
const REJECTED = 'REJECTED'; // 失败态

const resolvePromise = (promise, x, resolve, reject) => {
    // 如果x和promise2是同一个引用，要抛出异常
  // 注释① =============
  if (x === promise) {
    return reject(new TypeError('循环引用了。。。'));
  }
  let called = false; // 这个变量是为了防止既走成功又走失败，只能走一个
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then
      if(typeof then === 'function') {
        // then是函数，如果x是promise，则采用它的状态
        // 这里不能用 x.then，因为再取一次还是有可能报错，所以用上面已经取好的then变量
        then.call(x, (y) => {
          if (called) return;
          called = true;
          // 有可能y也是一个promise，则递归resolvePromise，直到返回的是一个普通值
          // 注释③ =============
          resolvePromise(promise, y, resolve, reject);
        }, (e) => {
          if (called) return;
          called = true;
          reject(e)
        })
      } else {
        // 普通对象，则调用resolve把这个结果传递到下一个then的成功回调
        resolve(x)
      }
    } catch (error) {
      // 取x.then可能报错
      if (called) return;
      called = true;
      reject(error)
    }
  } else {
    // 是普通值，则调用resolve把这个结果传递到下一个then的成功回调
    resolve(x);
  }
}

class Promise {
  constructor(executor) {
    this.status = PENDING; // 初始状态为pending
    this.value = ''; // 成功的原因
    this.reason = ''; // 失败的原因

    // 为什么是数组呢？
    /**
     * 因为同一个promise可以执行多次then
     * promise.then(() => {})
     * promise.then(() => {})
     * promise.then(() => {})
     */
    this.onResolvedCallbacks = []; // 存放成功的回调的队列
    this.onRejectedCallbacks = []; // 存放失败的回调的队列

    // resolve和reject 不是实例上的方法
    const resolve = (value) => {
      // 这个value可能是一个promise，要继续then递归解析，直到是普通值为止
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
      if(this.status === PENDING) { // 只有pending状态才能修改，一旦成功或者失败了，状态就不可变了
        this.value = value;
        this.status = FULFILLED;
        // 订阅，执行所有成功的回调
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    }
    const reject = (reason) => {
      if(this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        // 订阅，执行所有失败的回调
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    }

    // 这个立即执行的函数也需要做错误处理，一旦错误就reject
    try {
      executor(resolve, reject); // 立即执行
    } catch (error) {
      reject(error)
    }
  }
  // 其实这个then在实际情况中基本上就是在pending中保存回调函数（发布-订阅）
  // 在 resolve或者reject时  再调用对应的回调
  then(onfulfilled, onrejected) {
    // 判断这个两个回调是否是传递了，如果没传要给个默认的
    onfulfilled =
      typeof onfulfilled === 'function' ? onfulfilled : (value) => value;
    onrejected =
      typeof onrejected === 'function'
        ? onrejected
        : (reason) => {
            throw reason;
          };
    // 为了实现链式调用
    let newPromise =  new Promise((resolve, reject) => {
      if(this.status === FULFILLED) {
        // 当成功的时候调用成功的回调
        // 在new 的过程中 拿不到newPromise，所以加个定时器
        // 因为考虑到有可能throw，所以我们将其包在try/catch块里
        setTimeout(() => {
          try {
            let x = onfulfilled(this.value);
            resolvePromise(newPromise, x, resolve, reject);
          } catch(error) {
            reject(error);
          }
        }, 0)
      } else if (this.status === REJECTED) {
        // 当失败的时候调用成功的回调
        setTimeout(() => {
          try {
            let x = onrejected(this.reason)
            resolvePromise(newPromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0)
      } else {
        // 等待态，分别存放成功的回调和失败的回调，实际上就是发布
        
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onfulfilled(this.value);
              resolvePromise(newPromise, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          },0);
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onrejected(this.reason);
              resolvePromise(newPromise, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          },0);
        })
      }
    })
    return newPromise
  }
  catch(errCallback) {
    return this.then(null, errCallback);
  }

  // resolve 有等待效果，如果val是个promise会一直递归 直到是个普通值
  static resolve(val) {
    return new Promise((resolve, reject) => {
      // 这里有可能val是一个promise
      resolve(val)
    })
  }

  static reject(val) {
    return new Promise((resolve, reject) => {
      reject(val)
    })
  }
  static all(values) {
    return new Promise(function (resolve, reject) {
      if (!values.length) {
        resolve([]);
        return;
      }
      let res = [],
        count = 0;
      function setData(key, value) {
        res[key] = value;
        // 计数，当长度相同的时候，则表明数组全部循环结束
        if (++count === values.length) {
          resolve(res);
        }
      }
      for (let i = 0; i < values.length; i++) {
        let current = values[i];
        if (current && typeof current.then === 'function') {
          // 是promise
          current.then((data) => {
              // 成功了才计数
              setData(i, data);
            },reject // 如果异常了就直接调reject
          );
        } else {
          // 普通值
          setData(i, current);
        }
      }
    });
  }

  static allSettled(values) {
    return new Promise(function (resolve, reject) {
      if (!values.length) {
        resolve([]);
        return;
      }
      let res = [],
        count = 0;
      function setData(key, value) {
        res[key] = value;
        // 计数，当长度相同的时候，则表明数组全部循环结束
        if (++count === values.length) {
          resolve(res);
        }
      }
      for (let i = 0; i < values.length; i++) {
        let current = values[i];
        if (current && typeof current.then === 'function') {
          // 是promise
          current.then((data) => {
              // 成功 失败 都计数
              setData(i, data);
            },(err) => {
              setData(i, err);
            } // 如果异常了就直接调reject
          );
        } else {
          // 普通值
          setData(i, current);
        }
      }
    });
  }

  static race(values) {
    return new Promise(function (resolve, reject) {
      for (let i = 0; i < values.length; i++) {
        let current = values[i];
        if (current && typeof current.then === 'function') {
          // 判断是promise
          current.then(resolve, reject);
        } else {
          // 普通值
          resolve(current);
        }
      }
    });
  }

  /**
   * 返回一个promise，没有参数，无论如何都会执行，作为中间处理，也是一个then
   * 如果上一个是成功状态，
   */
   finally(callback) {
    return this.then(
      (data) => {
        // 函数内部执行，如果是promise就等待结果
        return Promise.resolve(callback()).then(() => data);
      },
      (err) => {
        return Promise.resolve(callback()).then(() => {
          throw err;
        });
      }
    );
  }
}

// 测试 
// promise 的延迟对象
Promise.defer = Promise.deferred = function() {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd
}
// yarn add promises-aplus-tests -g
// promises-aplus-tests promise.js
module.exports = Promise