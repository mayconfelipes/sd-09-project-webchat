const socket = window.io();

const nameRandom = `user-${Math.random().toString().slice(2, 13)}`;
const testid = 'data-testid';

const inputNickname = document.getElementById('nickname');
const formNickname = document.getElementById('form-nickname');
const nicknameButton = document.getElementById('nickname-button');

const usersOnline = document.getElementById('users-online');

const formChat = document.getElementById('form-send');
const inputChat = document.getElementById('input-send');
const sendButton = document.getElementById('send-button');

const messages = document.getElementById('messages');

let userNickname = nameRandom;

const renderUserOnline = () => {
  const li = document.createElement('li');
  li.innerText = userNickname;
  li.setAttribute(testid, 'online-user');
  usersOnline.appendChild(li);
};

const changeName = (e) => {
  e.preventDefault();
  if (inputNickname.value) {
    userNickname = inputNickname.value;
    usersOnline.innerHTML = '';
    renderUserOnline();
    inputNickname.value = '';
  }
};

const sendMessage = (e) => {
  e.preventDefault();
  if (inputChat.value) {
    socket.emit('message', { nickname: userNickname, chatMessage: inputChat.value });
    inputChat.value = '';
  }
};

const newMessage = (msg) => {
  const message = document.createElement('li');
  message.textContent = msg;
  message.setAttribute(testid, 'message');
  messages.appendChild(message);
  window.scrollTo(0, document.body.scrollHeight);
};

socket.on('connect', async () => {
  const history = await fetch('http://localhost:3000/history');
  const messagesHistory = await history.json();
  messagesHistory.forEach(({
    message,
    nickname,
    timestamp,
  }) => newMessage(`${timestamp} - ${nickname}: ${message}`));
});

socket.on('message', (msg) => newMessage(msg));

renderUserOnline();
nicknameButton.addEventListener('click', changeName);
formNickname.addEventListener('submit', changeName);
sendButton.addEventListener('click', sendMessage);
formChat.addEventListener('submit', sendMessage);
