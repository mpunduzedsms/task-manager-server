// index.js
const http = require('http');

// Task Manager Server
const greet = require('./utils');
console.log(greet('Mpundu Future'));

/*const server = http.createServer((req, res)=> {
    res.writeHead(200, {'content-Type': 'text/plain'});
    res.end('Hello Mpundu your Server.js is running successfuly!');
});*/

server.listen(3000, () => {
    console.log('Your Server is running on http://localhost:3000');
});