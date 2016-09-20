var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);


app.use(express.static(__dirname + '/public'));
//create arrays for users and connections
var users = [];
var connections = []

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html')
});


// open a connection with sockets
io.sockets.on('connection', function(socket) {
  // events to emit

  // connections
  connections.push(socket);
  console.log('connected: %s sockets connected ', connections.length)

  //disconnect
  socket.on('disconnect', function(data) {
    // if (!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1)
    console.log('Disconnected: %s sockets connected', connections.length)
  })

  //Send messages
  socket.on('send message', function(data) {
    io.sockets.emit('new message', {
      msg: data,
      user: socket.username
    });
  })

  //User login
  socket.on('new user', function(data, callback) {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames() {
    io.sockets.emit('get users', users);
  }

});

http.listen(3030);
