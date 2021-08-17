const socket = window.io();
// função io é uma função injetada ao objeto window do DOM da página

let userNick = '';
let onlineUsers = [];
const messageBtn = document.querySelector('#messageBtn');
const messageInput = document.querySelector('#messageInput');
const msgContainer = document.querySelector('#msgContainer');
const nickBtn = document.querySelector('#nickBtn');
const nickInput = document.querySelector('#nickInput');
const usersContainer = document.querySelector('#usersContainer');
const DATA_TEST_ID = 'data-testid';

const listUsers = (users) => {
  onlineUsers = users;
  usersContainer.innerHTML = '';
  usersContainer.innerText = 'Online:';
  users.forEach((user) => {
    const liUser = document.createElement('li');
    // liUser.setAttribute(DATA_TEST_ID, 'online-user');
    liUser.innerText = user.nickname;
    usersContainer.appendChild(liUser);
  });
};

const updateNick = (nick) => {
  userNick = nick;
  const user = document.querySelector('#user');
  const userId = document.querySelector('#userId');
  if (userId) {
    user.removeChild(userId);
    const userIndex = onlineUsers.findIndex((u) => u.nickname === userNick);
    onlineUsers[userIndex].nickname = nick;
  }
  const nickname = document.createElement('span');
  nickname.setAttribute(DATA_TEST_ID, 'online-user');
  nickname.setAttribute('id', 'userId');
  nickname.innerText = nick;
  user.appendChild(nickname);
  listUsers(onlineUsers);
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

const listMessages = (history) => {
  if (history) {
    history.forEach((msg) => {
      const { timestamp, nickname, message } = msg;
      addMessage(`${timestamp} - ${nickname}: ${message}`);
    });
  }
};

socket.on('connected', (nick) => updateNick(nick));
socket.on('history', (history) => listMessages(history));
socket.on('onlineUsers', (users) => listUsers(users));
socket.on('message', (message) => addMessage(message));
