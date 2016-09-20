$(function() {
  var socket = io.connect();
  var message = $('#message');
  var messageForm = $('#message-form');
  var messages = $('#messages');
  var messageRow = $('#message-row');
  var userForm = $('#user-form');
  var userName = $('#username');
  var userFormSection = $('#user-form-section');
  var users = $('#list-items');

  messageForm.submit(function(e) {
    e.preventDefault();
    socket.emit('send message', message.val());
    message.val('');
  });

  socket.on('new message', function(data) {
    messages.prepend('<div class="side"><strong>' + data.user + ':</strong>' + ' ' + data.msg + '</div>');
  })

  userForm.submit(function(e) {
    e.preventDefault();
    socket.emit('new user', userName.val(), function(data) {
      if (data) {
        userFormSection.hide();
        messageRow.show();
      }
    });
    userName.val('');
  });

  socket.on('get users', function(data) {
    var content = ''
    for (var i = 0; i < data.length; i++) {
      content += '<li class="list-item">' + data[i] + '</li>';
    }
    users.html(content)
  })

});
