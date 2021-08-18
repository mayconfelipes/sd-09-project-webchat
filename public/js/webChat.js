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

const listUsers = ({ nick = userNick, users }) => {
  onlineUsers = users;
  usersContainer.innerHTML = '';
  usersContainer.innerText = 'Online:';
  if (userNick !== '') {
    const liMyUser = document.createElement('li');
    liMyUser.setAttribute(DATA_TEST_ID, 'online-user');
    liMyUser.innerText = nick;
    usersContainer.appendChild(liMyUser);
  }
  onlineUsers.forEach((u) => {
    if (u.nickname !== userNick) {
      const liUser = document.createElement('li');
      liUser.setAttribute(DATA_TEST_ID, 'online-user');
      liUser.innerText = u.nickname;
      usersContainer.appendChild(liUser);
    }
  });
};

const createNick = (nick) => {
  const user = document.querySelector('#user');
  const nickname = document.createElement('span');
  nickname.setAttribute('id', 'userId');
  nickname.innerText = nick;
  user.appendChild(nickname);
};

const updateNick = ({ nick, users }) => {
  userNick = nick;
  const userId = () => (document.querySelector('#userId'));
  if (!userId()) createNick(nick);
  userId().innerHTML = nick;
  nickInput.value = '';
  listUsers({ users });
};

nickBtn.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('updateNick', { newNick: nickInput.value });
  updateNick({ nick: nickInput.value });
});

messageBtn.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: messageInput.value, nickname: userNick });
  messageInput.value = '';
});

const addMessage = (message) => {
  const msg = document.createElement('li');
  msg.setAttribute(DATA_TEST_ID, 'message');
  msg.innerText = message;
  msgContainer.appendChild(msg);
};

const removeNickname = (users) => {
  userNick = '';
  listUsers({ users });
};

socket.on('connected', updateNick);
socket.on('onlineUsers', listUsers);
socket.on('updateNick', updateNick);
socket.on('message', addMessage);
socket.on('disconnectUser', removeNickname);
