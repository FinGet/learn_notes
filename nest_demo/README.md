nest 在 @nestjs/cli 包里提供了 nest 命令，它可以用来做很多事情：

生成项目结构和各种代码
编译代码
监听文件变动自动编译
打印项目依赖信息
也就是这些子命令：

nest new 快速创建项目
nest generate / nest g 快速生成各种代码
nest build 使用 tsc 或者 webpack 构建代码
nest start 启动开发服务，支持 watch 和调试
nest info 打印 node、npm、nest 包的依赖版本
并且，很多选项都可以在 nest-cli.json 里配置，比如 generateOptions、compilerOptions 等。

## 5种http数据传输方式
1. url params
`http://guang.zxg/person/1111`
2. query params
`http://guang.zxg/person?name=guang&age=20`
这里的 name 和 age 就是 query 传递的数据。

其中非英文的字符和一些特殊字符要经过编码，可以使用 encodeURIComponent 的 api 来编码：
```javascript
const query = "?name=" + encodeURIComponent('光') + "&age=20"
// ?name=%E5%85%89&age=20
```
或者使用封装了一层的 query-string 库来处理。
```javascript
const queryString = require('query-string');

queryString.stringify({
  name: '光',
  age: 20
});

// ?name=%E5%85%89&age=20
```

3. form-urlencoded
`Content-Type: application/x-www-form-urlencoded`
因为内容也是 query 字符串，所以也要用 encodeURIComponent 的 api 或者 query-string 库处理下。

这种格式也很容易理解，get 是把数据拼成 query 字符串放在 url 后面，于是表单的 post 提交方式的时候就直接用相同的方式把数据放在了 body 里。

通过 & 分隔的 form-urlencoded 的方式需要对内容做 url encode，如果传递大量的数据，比如上传文件的时候就不是很合适了，因为文件 encode 一遍的话太慢了，这时候就可以用 form-data。

4. form-data
`Content-Type: multipart/form-data`

这种方式是用来上传文件的，它的格式是比较复杂的，需要用到 boundary 来分隔不同的数据。

5. json
`Content-Type: application/json`
json 格式的数据传输是最简单的，也是最常用的，因为 json 格式的数据可以直接用 JSON.stringify 来处理，也可以直接用 JSON.parse 来解析。

## 断点调试
node 代码可以加上 --inspect 或者 --inspect-brk 启动调试 ws 服务，然后用 Chrome DevTools 或者 vscode debugger 连上来调试。

nest 项目的调试也是 node 调试，可以使用 nest start --debug 启动 ws 服务，然后在 vscode 里 attach 上来调试，也可以添加个调试配置来运行 npm run start:dev。

nest 项目最方便的调试方式还是在 VSCode 里添加 npm run start:dev 的调试配置。

此外，我们还理解了 logpoint、条件断点、异常断点等断点类型。