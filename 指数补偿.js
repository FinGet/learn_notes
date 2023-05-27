let timer = null;
let delay = 1000;
const simplePoller = (queryFn, callback) => {
  if(queryFn()) {
    callback();
  } else {
    timer = setTimeout(() => {
      clearTimeout(timer);
      console.log(`间隔${delay}ms`)
      simplePoller(queryFn, callback);
      delay = delay * 1.5;
    }, delay);
  }
}


const queryFn = () => {
  let count = 0;
  return () => {
    count++;
    console.log(`第${count}次调用，queryFn`);
    return count > 3;
  }
}

const callback = () => {
  console.log('callback');
}

simplePoller(queryFn(), callback);