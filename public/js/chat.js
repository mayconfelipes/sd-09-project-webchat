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

socket.on('allUsers', (getUsers) => {
  users.innerHTML = '';

  const userFind = getUsers.filter(({ idSocket }) => idSocket === idSocketFront);
  userFind.forEach(({ nickname: nick }) => {
    createListUsers(nick);
  });

  const usersFilter = getUsers.filter(({ idSocket }) => idSocket !== idSocketFront);
  usersFilter.forEach(({ nickname: nick }) => {
    createListUsers(nick);
  });
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
  users.innerHTML = '';

  const userFind = listUser.filter(({ idSocket }) => idSocket === idSocketFront);
  userFind.forEach(({ nickname: nick }) => {
    createListUsers(nick);
  });

  const usersFilter = listUser.filter(({ idSocket }) => idSocket !== idSocketFront);
  usersFilter.forEach(({ nickname: nick }) => {
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

socket.on('history', (test) => {
  test.forEach(({ message }) => {
    createListMessage(message);
  });
});
