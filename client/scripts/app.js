
var app = {};

app.server = 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages';
app.username = window.location.search.slice(10);
app.chatMessages = [];

app.init = function () {
  $('#main').on('click', '.username', function() {
    app.handleUsernameClick();
  });

  // $('#send .submit').submit(app.handleSubmit);
  $('#send .submit').on('click', function() {
    if ($('#message').val()) {
      app.handleSubmit();
      app.renderMessage($('#message').val(), app.username);
      $('#message').val('');
    }
  });
};

app.send = function (message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,                                              
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function () {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: 'order=-createdAt',
    contentType: 'application/json',
    success: function (data) {
      app.chatMessages = data.results;
      app.chatMessages.forEach(function(message) {
        app.renderMessage(message);
      });
      console.log('chatterbox: Messages received');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive messages', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats > div').remove();
};

app.renderMessage = function(message, username, roomName) {
  roomName = message.roomname || 'lobby';
  username = message.username || username;
  message = message.text || message; 
  var $message = `<div class="message "${roomName}>
    <div>${username}</div>
    <div>${message}</div>
  </div>`;
  $('#chats').append($message);
};

app.renderRoom = function(roomName) {
  $('#roomSelect').append(`<option value="${roomName}">${roomName}</option>`);
};

app.handleUsernameClick = function() {
};

app.handleSubmit = function() {
  app.send();
};

app.filterByRooms = function(roomName) {
  for (let message of app.chatMessages) {
    if (message.roomname === roomName) {
      app.renderMessage(message);
    }
  }
};

$(document).ready(function() {
  app.init();

  setInterval(function() {
    app.fetch();
  }, 1000);


  
});