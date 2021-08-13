const socket = window.io();

let nickname = '';

const formNickname = document.querySelector('.form-nickname-input');
const inputNickname = document.querySelector('#nickname-input');
const formMessage = document.querySelector('.form-message-input');
const inputMessage = document.querySelector('#message-input');
const messages = document.getElementById('messages');

const createListMessage = (message) => {
  const li = document.createElement('li');
  li.innerHTML = message;
  messages.appendChild(li);
  return li;
};

formNickname.addEventListener('submit', (e) => {
  e.preventDefault();
  // socket.emit('nickname', inputNickname.value);
  nickname = inputNickname.value;
  inputNickname.value = '';
  return false;
});

formMessage.addEventListener('submit', (e) => {
  e.preventDefault();
  const chatMessage = inputMessage.value;
  socket.emit('message', { nickname, chatMessage });
  inputMessage.value = '';
  return false;
});

socket.on('message', (message) => {
  createListMessage(message);
});

socket.on('userOn', (id) => {
  console.log(id);
});
