// const socket = io();
const socket = io('http://localhost:3000');

const button = document.querySelector('#pingButton');

button.addEventListener('click', (e) => {
  socket.emit('ping', { e });
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  messagesUl.appendChild(li);
}

socket.on('ola', (mensagem) => createMessage(mensagem));
socket.on('pong', (mensagem) => createMessage(mensagem));
