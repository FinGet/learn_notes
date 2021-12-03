const fs = require('fs').promises;
const Promise = require('./promise');

const isPromise = value => typeof value.then === 'function';
Promise.all = function(promises) {
  return new Promise((resolve, reject) => {
    let arr = [];
    let count = 0;
    const processData = (key, data) => {
      arr[key] = data
      if(++count === promises.length) {
        resolve(arr)
      }
    }
    for(let i = 0; i < promises.length; i++) {
      let result = promises[i]
      if(isPromise(result)) {
        result.then(data => {
          processData(i, data)
        }, reject)
      } else {
        processData(i, result)
      }
    }
  })
}

Promise.all([1,2,fs.readFile('./name.txt','utf8'), fs.readFile('./age.txt','utf8')]).then(data => {
  console.log('1111',data)
})