const http = require('http')
const fs = require('fs')
http.createServer((req,res) => {
	console.log(req.url)
	fs.readFile(`.${req.url}`, (err, data) => {
		if(err) {
  		res.writeHeader(404) 
  		res.write('Not Found')
		} else {
			res.write(data)
		}
		res.end()
	})
}).listen(8080)
