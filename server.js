var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use("/", express.static(__dirname + "/public"));

io.on('connection', function(evenement) {
    var userLog;

    evenement.on('username', function(user) {
        userLog = user;
    });

    evenement.on('discussion', function(msg) {
        msg.name = userLog.name;
        io.emit('discussion', msg);
    });

});

http.listen(3000, function() {
    console.log('Server start !');
});
