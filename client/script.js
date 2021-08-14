// const socket = io();
const socket = io('http://localhost:3000');


const nicknameBtn = document.querySelector('#nickname-btn');
const sendBtn = document.querySelector('#send-btn');

nicknameBtn.addEventListener('click', (e) => {
  socket.emit('change-nickname');
  return false;
});

sendBtn.addEventListener('click', (e) => {
  socket.emit('send-message');
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages-list');
  const li = document.createElement('li');
  li.innerText = message;
  messagesUl.appendChild(li);
}

socket.on('change-nickname', (mensagem) => createMessage(mensagem));
socket.on('pong', (mensagem) => createMessage(mensagem));
socket.on('todos', (mensagem) => createMessage(mensagem));
