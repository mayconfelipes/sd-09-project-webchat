const socket = window.io();

const onlineUsers = document.querySelector('#online-users');
const nicknameBox = document.querySelector('#nickname-box');
const nicknameButton = document.querySelector('#nickname-button');

const messageBox = document.querySelector('#message-box');
const sendButton = document.querySelector('#send-button');
const messages = document.querySelector('#messages');

const DATA_TESTID = 'data-testid';
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
  li.setAttribute(DATA_TESTID, 'message'); 
  messages.appendChild(li);
});

socket.on('allUsers', (allUsers) => {
  onlineUsers.innerHTML = '';

  const userLi = document.createElement('li');
  userLi.innerText = nickname;
  userLi.setAttribute(DATA_TESTID, 'online-user'); 
  onlineUsers.appendChild(userLi);

  const filter = allUsers.filter((f) => f !== nickname);
  filter.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user;
    li.setAttribute(DATA_TESTID, 'online-user'); 
    onlineUsers.appendChild(li);
  });
});

socket.on('chatMongoDB', (mongoDB) => {
  mongoDB.forEach((messageDB) => {
    const li = document.createElement('li');
    li.innerText = messageDB.message;
    li.setAttribute(DATA_TESTID, 'message'); 
    messages.appendChild(li);
  });
});