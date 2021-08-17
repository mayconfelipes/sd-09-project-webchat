const socket = window.io();
// função io é uma função injetada ao objeto window do DOM da página

let userNick = '';
const messageBtn = document.querySelector('#messageBtn');
const messageInput = document.querySelector('#messageInput');
const msgContainer = document.querySelector('#msgContainer');
const nickBtn = document.querySelector('#nickBtn');
const nickInput = document.querySelector('#nickInput');
const usersContainer = document.querySelector('#usersContainer');
const DATA_TEST_ID = 'data-testid';

const updateNick = (nick) => {
  userNick = nick;
  const user = document.querySelector('#user');
  const userId = document.querySelector('#userId');
  if (userId) {
    user.removeChild(userId);
  }
  const nickname = document.createElement('span');
  nickname.setAttribute(DATA_TEST_ID, 'online-user');
  nickname.setAttribute('id', 'userId');
  nickname.innerText = nick;
  user.appendChild(nickname);
};

nickBtn.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('updateNick', { defaultNick: userNick, newNick: nickInput.value });
  updateNick(nickInput.value);
  nickInput.value = '';
  return false;
});

messageBtn.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: messageInput.value, nickname: userNick });
  messageInput.value = '';
  return false;
});

const addMessage = (message) => {
  const msg = document.createElement('p');
  msg.setAttribute(DATA_TEST_ID, 'message');
  msg.innerText = message;
  msgContainer.appendChild(msg);
};

const listUsers = (users) => {
  users.forEach((user) => {
    const liUser = document.createElement('li');
    liUser.setAttribute(DATA_TEST_ID, 'online-user');
    liUser.innerText = user.nickname;
    usersContainer.appendChild(liUser);
  });
};

socket.on('connected', (nick) => updateNick(nick));
socket.on('onlineUsers', (users) => listUsers(users));
socket.on('message', (message) => addMessage(message));
