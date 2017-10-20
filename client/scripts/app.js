var app = {};

app.init = function () {
  $('#main').on('click', '.username', function() {
    app.handleUsernameClick();
  });

  $('#send .submit').submit(app.handleSubmit);
};

app.send = function (message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: message,
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
    url: undefined,
    type: 'GET',
    data: message,
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

app.clearMessages = function() {
  $('#chats > blink').remove();
};

app.renderMessage = function(message) {
  $('#chats').html(`<blink>${message.text}</blink>`);
};

app.renderRoom = function(roomName) {
  $('#roomSelect').append(`<div>${roomName}</div>`);
};

app.handleUsernameClick = function() {
};

app.handleSubmit = function() {
};