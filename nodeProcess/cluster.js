const http = require('http');
const cluster = require('cluster'); // 集群
const cpuCoreLength = require('os').cpus().length; // cpu 内核数

if(cluster.isMaster) {
  for(let i = 0; i < cpuCoreLength; i++) {
    cluster.fork(); // 开启子进程
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork(); // 进程守护 关闭一个，再开启一个
  });
} else {
  // 多个子进程会共享同一个TCP链接，提供一份网络服务
  const server = http.createServer((req, res) => {
    res.end('done in: ' + process.pid);
  })
  server.listen(3000, () => {
    console.log(process.pid + ' localhost:3000'); // 8核内存就会开启八个
  })
}

// 工作中使用 pm2 的 cluster mode 开启多个子进程