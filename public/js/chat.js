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

const renderUserOnline = (usersNames) => {
  usersOnline.innerHTML = '';
  usersNames.forEach(({ nickname }) => {
    const user = document.createElement('li');
    user.innerText = nickname;
    user.setAttribute(testid, 'online-user');
    if (userNickname === nickname) usersOnline.insertBefore(user, usersOnline.firstChild);
    else usersOnline.appendChild(user);
  });
};

const changeName = (e) => {
  e.preventDefault();
  if (inputNickname.value) {
    userNickname = inputNickname.value;
    socket.emit('changeName', userNickname);
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

  socket.emit('userName', userNickname);
});

socket.on('message', (msg) => newMessage(msg));

socket.on('usersOnline', (usersNames) => renderUserOnline(usersNames));

socket.on('disconnectUser', (usersNames) => renderUserOnline(usersNames));

nicknameButton.addEventListener('click', changeName);
formNickname.addEventListener('submit', changeName);
sendButton.addEventListener('click', sendMessage);
formChat.addEventListener('submit', sendMessage);
