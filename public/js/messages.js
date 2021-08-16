const socket = window.io();

const form = document.querySelector('.send-message-form');
const inputMessage = document.querySelector('.send-message-input');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('clicado');
  const chatMessage = inputMessage.value;
  const nickname = socket.id;
  socket.emit('message', { chatMessage, nickname });
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('.messages-container');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  messagesUl.appendChild(li);
};

socket.on('message', (message) => createMessage(message));