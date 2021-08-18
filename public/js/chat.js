const socket = window.io();

const nameRandom = `user-${Math.random().toString().slice(2, 13)}`;

const inputNickname = document.getElementById('nickname');
const nicknameBox = document.getElementById('nickname-box');
const formNickname = document.getElementById('form-nickname');
const nicknameButton = document.getElementById('nickname-button');

const usersOnline = document.getElementById('users-online');

const formChat = document.getElementById('form');
const inputChat = document.getElementById('input');
const sendButton = document.getElementById('send-button');

const messages = document.getElementById('messages');

let nickname = nameRandom;
nicknameBox.setAttribute('data-testid', 'nickname-box');
nicknameBox.innerText = nickname;

const li = document.createElement('li');
li.innerText = nickname;
li.setAttribute('data-testid', 'online-user');
usersOnline.appendChild(li);

nicknameButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (inputNickname.value) {
    nickname = inputNickname.value;
    nicknameBox.innerText = nickname;
    inputNickname.value = '';
  }
});

sendButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (inputChat.value) {
    socket.emit('message', { nickname, chatMessage: inputChat.value });
    inputChat.value = '';
  }
});

socket.on('message', (msg) => {
  const message = document.createElement('li');
  message.textContent = msg;
  message.setAttribute('data-testid', 'message');
  messages.appendChild(message);
  window.scrollTo(0, document.body.scrollHeight);
});
