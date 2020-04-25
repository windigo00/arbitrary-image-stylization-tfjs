var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var DnnApp = require('./node_app');

const port = 8081;
const hostname = '127.0.0.1';

app.get('/', function (req, res) {
    res.end('Hello World');
//    res.sendFile(__dirname + '/newhtml.html');
});

var dnn;
io.on('connection', function (socket) {
    console.log('a user connected');

    if (!dnn) {
        dnn = new DnnApp;
    }

    socket.on('init', function (msg) {
        console.log('init');
    }).on('style message', function (msg) {
        console.log('style message: ');
        dnn.predict(socket, msg.data);
    });
});

http.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});
