
const getSum = () => {
	let n = 0
	for(let i = 0; i < 1000; i ++) {
		n += i
	}
	return n;
}

process.on('message', (msg) => {
	console.log('子进程id', process.pid);
	if(msg === '开始计算') {
		const sum = getSum();
		process.send(sum + ''); // 接受字符串
		process.exit();
	}
})