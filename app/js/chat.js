const socket = window.io();
const form = document.querySelector('#chat');
const input = document.querySelector('#message');
const messages = document.querySelector('#messages');

const nickname = Math
  .random().toString(36).substring(4, 15) + Math
    .random().toString(36).substring(5, 15);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input.value) {
    socket.emit('serverMessage', { chatMessage: input.value, nickname });
    input.value = '';
  }
});

socket.on('message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
});