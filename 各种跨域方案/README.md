## 同源策略

协议、域名、端口、三则相同。

> IE 未将端口号加入到同源策略的组成部分之中，因此 http://company.com:81/index.html 和 http://company.com/index.html  属于同源并且不受任何限制。

## 为什么浏览器不支持跨域
同源策略，其初衷是为了浏览器的安全性，通过以下三种限制，保证浏览器不易受到XSS、CSFR等攻击。

- Cookie、LocalStorage 和 IndexDB 无法读取
- DOM 和 Js对象无法获得
- AJAX 请求不能发送

## 实现跨域

- jsonp
- cors 纯后端
- postMessage + iframe两个页面间
- document.domain+ iframe 同域下的子域通信
- window.name+ iframe
- location.hash+ iframe
- http-proxy nodejs中间件代理跨域
- nginx
- websocket


### jsonp

利用`script` 标签自带`src`属性天生可跨域的特点实现。

- 只能发送get请求， 不支持post put delete
- 不安全 xss攻击（请求的js中有攻击代码）

### cors

>跨域资源共享(CORS) 是一种机制，它使用额外的 HTTP 头来告诉浏览器  让运行在一个 origin (domain) 上的Web应用被准许访问来自不同源服务器上的指定的资源。当一个资源从与该资源本身所在的服务器不同的域、协议或端口请求一个资源时，资源会发起一个跨域 HTTP 请求。-- MDN


服务端设置白名单：`Access-Control-Allow-Origin`


```javascript
response.writeHead(200, {
	// 设置哪个源可以访问
  'Access-Control-Allow-Origin': '*',
  // 允许携带的头
  'Access-Control-Allow-Headers': 'X-Test-Cors',
  // 允许访问的方法
  'Access-Control-Allow-Methods': 'POST, PUT, DELETE',
  // 预请求过期时间
  'Access-Control-Max-Age': '1000'
})
```


更多cors内容[点击这里](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)


### postMessage

```javascript
function load() {
	let frame = document.getElementById('frame');

	frame.contentWindow.postMessage('发给你消息！','http://localhost:4000/3_postMessage2.html')

	window.onmessage = function(e) {
		console.log(e.data)
	}
}
```

### window.domain

该方式只能用于二级域名相同的情况下，比如 a.test.com 和 b.test.com 适用于该方式。
只需要给页面添加 document.domain ='test.com' 表示二级域名都相同就可以实现跨域。
实现原理：两个页面都通过js强制设置document.domain为基础主域，就实现了同域。


### window.name

```
<ul>
	<li>a和b是同域的：http://localhost:3000</li>
	<li>c是独立的：http://localhost:4000</li>
	<li>a获取c的数据</li>
</ul>
<pre>
	a先引用c c把值放到window.name，把a引用的地址改到b
</pre>
```

通过iframe的src属性由外域转向本地域，跨域数据即由iframe的window.name从外域传递到本地域。这个就巧妙地绕过了浏览器的跨域访问限制，但同时它又是安全操作。



### location.hash

```
<ul>
	<li>a和b是同域的：http://localhost:3000</li>
	<li>c是独立的：http://localhost:4000</li>
	<li>a获取c的数据</li>
</ul>
<pre>
	a给c传一个hash值 c收到hash值后  c把hash值传递给b b将结果放到a的hash中
</pre>
```

实现原理： a.html欲与c.html跨域相互通信，通过中间页b.html来实现。 三个页面，不同域之间利用iframe的location.hash传值，相同域之间直接js访问来通信。

具体实现步骤：一开始a.html给c.html传一个hash值，然后c.html收到hash值后，再把hash值传递给b.html，最后b.html将结果放到a.html的hash值中。
同样的，a.html和b.html是同域的，都是http://localhost:3000;而c.html是http://localhost:4000


### nodejs中间件代理跨域

实现原理：同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就无需遵循同源策略。 代理服务器，需要做以下几个步骤：

1. 接受客户端请求 。
2. 将请求 转发给服务器。
3. 拿到服务器 响应 数据。
4. 将 响应 转发给客户端。








