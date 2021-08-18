const socket = window.io();

const onlineUsers = document.querySelector('#online-users');
const nicknameBox = document.querySelector('#nickname-box');
const nicknameButton = document.querySelector('#nickname-button');

const messageBox = document.querySelector('#message-box');
const sendButton = document.querySelector('#send-button');
const messages = document.querySelector('#messages');

let nickname = null;

nicknameButton.addEventListener('click', () => {
  socket.emit('changeNickname', nicknameBox.value);
  nickname = nicknameBox.value;
  nicknameBox.value = '';
});

sendButton.addEventListener('click', () => {
  socket.emit('message', {
      nickname,
      chatMessage: messageBox.value,
  });
  messageBox.value = '';
});

socket.on('changeNickname', (newNickname) => {
  nickname = newNickname;
});

socket.on('message', (data) => {
  const li = document.createElement('li');
  li.innerText = data;
  li.setAttribute('data-testid', 'message'); 
  messages.appendChild(li);
});

socket.on('allUsers', (allUsers) => {
  allUsers.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user;
    li.setAttribute('data-testid', 'online-user'); 
    onlineUsers.appendChild(li);
  });
});