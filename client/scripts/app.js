
var app = {};

app.server = 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages';

app.urlScraping = window.location.search.slice(10).split('&&');
app.username = app.urlScraping[0];
app.roomname = app.urlScraping[1].slice(9);
app.chatMessages = [];

app.formatMessage = function(message, roomname) {
  return {
    text: message,
    username: app.username,
    roomname: roomname || app.roomname
  };
};

app.init = function () {
  $('#main').on('click', '.username', function() {
    app.handleUsernameClick();
  });

  // $('#send .submit').submit(app.handleSubmit);
  $('#send .submit').on('click', function() {
    if ($('#message').val()) {
      app.handleSubmit();
    }
  });

  $('#rooms').on('click', 'a', function() {
    app.clearMessages();
    app.filterByRoom(this.closest('div').className);
  });

  $('#chats').on('click', '.message', function() {
    var username = Array.prototype.slice.call(this.classList, 2).join(' ');
    if (!$('#friends > div').hasClass(username)) {
      $('#friends').append(`<div class="${username}">${username}</div>`);

      var messages = Array.from($('#chats div'));
      for (let message of messages) {
        if (message.classList.contains(username)) {
          message.classList.add('bold');
        }
      }
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
        if (!$('#rooms > div').hasClass(message.roomname)) {
          app.renderRoom(message.roomname);
        }
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
  roomName = _.escape(message.roomname) || app.roomname;
  username = _.escape(message.username) || username;
  message = _.escape(message.text) || message; 
  var $message = `<div class="message ${roomName} ${username}">
    <div class="user"><a href=#>${username}</a></div>
    <div>${message}</div>
  </div>`;

  if ($('#friends > div.user').hasClass(username)) {
    this.classList.add('bold');
  }

  $('#chats').append($message);
};

app.renderRoom = function(roomName) {
  $('#rooms').append(`<div class="${roomName}"><a href=#>${roomName}</a></div>`);
};

app.handleUsernameClick = function() {
};

app.handleSubmit = function() {
  var message = app.formatMessage($('#message').val());
  app.send(message);
  $('#message').val('');
  app.fetch();
};

app.filterByRoom = function(roomName) {
  // var messages = Array.from($('#chats div'));
  // messages.forEach(function(div) {
  //   if (!div.classList.contains(roomName)) {
  //     div.classList.add('hide');  
  //   }
  // });

  app.fetch();
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

  if (!$('#rooms > div').hasClass(app.roomname)) {
    app.renderRoom(app.roomname);
  }
  
});