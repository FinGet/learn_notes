let fn = function() {
	return new Promise((reslove, reject) => {
		setTimeout(() => {
			reject('error')
		}, 1000)
	})
}

fn().then(() => {
	console.log('success')
}, (err) => {
	console.log(err)
}).then(() => {
	console.log('success then')
}).catch(() => {
	console.log('catch')
})