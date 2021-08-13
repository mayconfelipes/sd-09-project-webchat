const socket = window.io();

const formMessages = document.querySelector('#formMessages');
const formNickname = document.querySelector('#formNickname');
const inputMessage = document.querySelector('#messageInput');
const inputNickName = document.querySelector('#nicknameInput');

const objMessage = {
  chatMessage: '',
  nickname: '',
};

formNickname.addEventListener('submit', (e) => {
  e.preventDefault();
  objMessage.nickname = inputNickName.value;
  socket.emit('nickname', inputNickName.value);
});

formMessages.addEventListener('submit', (e) => {
  e.preventDefault();
  objMessage.chatMessage = inputMessage.value;
  socket.emit('message', objMessage);
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  messagesUl.appendChild(li);
};

const createListNickname = (nickname) => {
  const usersUl = document.querySelector('#users');
  const li = document.createElement('li');
  li.innerText = nickname;
  usersUl.appendChild(li);
};

socket.on('message', (message) => createMessage(message));
socket.on('nickname', (nickname) => createListNickname(nickname));