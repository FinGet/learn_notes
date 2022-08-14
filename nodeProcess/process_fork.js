const http = require('http');
const fork = require('child_process').fork

const server = http.createServer((req, res) => {
	if(req.url === '/get-sum') {
		console.log('主进程id', process.pid);
		const childProcess = fork('./computed.js');

		childProcess.send('开始计算');

		childProcess.on('message', (msg) => {
			console.log(msg)
			res.end(msg);
		})

		childProcess.on('error', (err) => {
			res.end(err);
			childProcess.kill();
		})
	} else {
		res.end('hello');
	}
})

server.listen(4000, () => {
	console.log('localhost:3000')
})
