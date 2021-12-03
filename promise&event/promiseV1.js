// 自己实现一个promise 遵循Promise A+规范（https://promisesaplus.com/）

// 三种状态
const PENDING = 'PENDING'; // 等待态
const FULFILLED = 'FULFILLED'; // 成功态
const REJECTED = 'REJECTED'; // 失败态

class Promise {
  constructor(executor) {
    this.status = PENDING; // 默认是等待态
    this.value = ''; // 成功的原因
    this.reason = ''; // 失败的原因
    this.onResolvedCallbacks = []; // 存放成功的回调的队列
    this.onRejectedCallbacks = []; // 存放失败的回调的队列
    const resolve = (value) => {
      if (this.status === PENDING) {
        // 只有当前是等待状态才能变成成功态
        this.status = FULFILLED;
        this.value = value;
        // 订阅，执行所有成功的回调
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    };
    const reject = (reason) => {
      if (this.status === PENDING) {
        // 只有当前是等待状态才能变成失败态
        this.status = REJECTED;
        this.reason = reason;
        // 订阅，执行所有失败的回调
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };
    // 捕获一下异常
    try {
      executor(resolve, reject);
    } catch (e) {
      // 出错了就走reject
      reject(e);
    }
  }
  /**
   *
   * @param {成功的回调} onfulfilled
   * @param {失败的回调} onrejected
   */
  then(onfulfilled, onrejected) {
    if (this.status === FULFILLED) {
      // 当成功的时候调用成功的回调
      onfulfilled(this.value);
    } else if (this.status === REJECTED) {
      // 当失败的时候调用成功的回调
      onrejected(this.reason);
    } else {
      // 等待态，分别存放成功的回调和失败的回调，实际上就是发布
      this.onResolvedCallbacks.push(() => {
        onfulfilled(this.value);
      });
      this.onRejectedCallbacks.push(() => {
        onrejected(this.reason);
      });
    }
  }
}

module.exports = Promise;
