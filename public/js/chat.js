const socket = window.io();

const form = document.querySelector('form');
const chatMessage = document.querySelector('#messageInput');
// const inputName = document.querySelector('#nickName');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: chatMessage.value });
  chatMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  messagesUl.appendChild(li);
};

socket.on('message', (message) => {
  createMessage(message);
});