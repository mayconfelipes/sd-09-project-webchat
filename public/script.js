const socket = window.io();

const nicknameBtn = document.querySelector('#nickname-btn');
const sendBtn = document.querySelector('#send-btn');

const messagesUl = document.querySelector('#messages-list');
const usersUl = document.querySelector('#users-list');

let nickname = null;

sendBtn.addEventListener('click', () => {
  const messageInput = document.querySelector('#message-input').value;
  socket.emit('message', {
    nickname,
    chatMessage: messageInput,
  });

  return false;
});

nicknameBtn.addEventListener('click', () => {
  const nicknameInput = document.querySelector('#nickname-input').value;
  nickname = nicknameInput;
  socket.emit('nickname', nicknameInput);

  return false;
});

// Retornos
socket.on('message', (message) => {
  const messageLI = document.createElement('li');
  messageLI.innerHTML = message;
  messageLI.setAttribute('data-testid', 'message');
  messagesUl.appendChild(messageLI);
});

socket.on('updateList', (users) => {
  if (usersUl) usersUl.innerHTML = '';
  users.forEach((user) => {
    const userLi = document.createElement('li');
    userLi.innerHTML = user;
    userLi.setAttribute('data-testid', 'online-user');
    usersUl.appendChild(userLi);
  });
});
