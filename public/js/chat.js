const socket = window.io();

let nickname = '';
let idSocketFront = '';

const formNickname = document.querySelector('.form-nickname-input');
const inputNickname = document.querySelector('#nickname-input');
const formMessage = document.querySelector('.form-message-input');
const inputMessage = document.querySelector('#message-input');
const messages = document.getElementById('messages');
const users = document.getElementById('users');

const createListUsers = (user) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'online-user');
  li.innerHTML = user;
  users.appendChild(li);
  return li;
};

socket.on('userOn', ({ idSocket }) => {
  idSocketFront = idSocket;
  socket.emit('nickname', ({ idSocket, newNick: idSocket }));
  createListUsers(idSocket);
});

const createListMessage = (message) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerHTML = message;
  messages.appendChild(li);
  return li;
};

formNickname.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('updateNickname', ({ idSocket: idSocketFront, newNick: inputNickname.value }));
  nickname = inputNickname.value;
  inputNickname.value = '';
  users.innerHTML = '';
  return false;
});

socket.on('updateNickname', (listUser) => {
  listUser.forEach(({ nickname: nick }) => {
    createListUsers(nick);
  });
});

formMessage.addEventListener('submit', (e) => {
  e.preventDefault();
  const chatMessage = inputMessage.value;
  socket.emit('message', { nickname, chatMessage });
  inputMessage.value = '';
  return false;
});

socket.on('message', (message) => {
  createListMessage(message);
});
