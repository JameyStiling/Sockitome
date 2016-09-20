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
io.on('connection', function(socket) {

  // connections
  // each connection to the socket from the client gets push onto the
  // array.  this allows to keep track of the amount of connected users
  connections.push(socket);
  console.log('connected: %s sockets connected ', connections.length)

  //disconnected
  socket.on('disconnect', function(data) {
    // remove the user that disconnected the socket
    users.splice(users.indexOf(socket.username), 1);
    // updates user names and emits to client the updated list
    updateUsernames();
    // remove socket that disconnected
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
    // updates user names and emits to client the updated list
    updateUsernames();
  });

  // function to update user names and emits to client the updated list
  function updateUsernames() {
    io.sockets.emit('get users', users);
  }

});

http.listen(3030);
