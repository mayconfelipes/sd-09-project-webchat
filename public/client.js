const socket = window.io();
const { $ } = window;
let nickname;

const renderMessage = (msg) => $('#messages').append(`<li data-testid="message">${msg}</li>`);

$('#nickname-button').click(() => {
  nickname = $('#nickname-box').val();
  $('#user').text(nickname);
  socket.emit('newUser', nickname);
});

$('form').submit((e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: $('#message-box').val(), nickname });
  $('#message-box').val('');
});

socket.on('newConnection', ({ userId, messages }) => {
  nickname = userId;
  messages.forEach((msg) => renderMessage(msg));
  socket.emit('newUser', nickname);
});

socket.on('message', (msg) => renderMessage(msg));

socket.on('users', (users) => {
  $('#users').html('');
  $('#users').append(`<p data-testid="online-user" id="user">${nickname}</p>`);
  users.forEach((user) =>
    (user !== nickname) && $('#users').append(`<p data-testid="online-user">${user}</p>`));
});
