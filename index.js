const http = require('http');

const server = http.createServer((req, res) => {
  // 设置 HTTP 头部
  res.writeHead(200, { 
    'Content-Type': 'text/event-stream', // 事件流
    'Cache-Control': 'no-cache', // 不缓存
    'Connection': 'keep-alive', // 保持连接
    'Access-Control-Allow-Origin': '*', // 允许跨域
   });

  if(req.url === '/api/test') {


    // // 要返回的字符串
    const text = '这是一段测试文本。测试流式数据的传输和接收';

    // // 逐字发送数据
    // let i = 0;
    // const intervalId = setInterval(() => {
    //   if (i < text.length) {
    //     res.write(text.charAt(i));
    //     i++;
    //   } else {
    //     clearInterval(intervalId);
    //     res.end();
    //   }
    // }, 100); // 每隔 100 毫秒发送一个字
    // 
    // res.write("retry: 10000\n");
    // res.write("event: connecttime\n");
    // res.write("data: " + (new Date()) + "\n\n");
    // res.write("data: " + (new Date()) + "\n\n");

    let i = 0;
    interval = setInterval(function () {
      // res.write("data: " + (new Date()) + "\n\n");
      if (i < text.length) {
        // res.write("data: " + text.charAt(i) + "\n\n");
        res.write(text.charAt(i));
        i++;
      } else {
        console.log('end')
        clearInterval(interval);
        res.end();
      }
    }, 100);

    req.connection.addListener("close", function () {
      clearInterval(interval);
    }, false);
  }
});

server.listen(3300, () => {
  console.log('Server listening on port 3000');
});
