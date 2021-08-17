const socket = window.io();
const datatest = 'data-testid';
const form = document.querySelector('#chat');
const input = document.querySelector('#message');
const messages = document.querySelector('#messages');
const formNickname = document.querySelector('#set-nickname');
const nickInput = document.querySelector('#input-nick');
const listUsers = document.querySelector('#user-list');
const nickField = document.querySelector('#nick-field');

const generateNickname = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

let nickname = generateNickname(16);
socket.emit('setNicks', nickname);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input.value) {
    socket.emit('message', { chatMessage: input.value, nickname });
    input.value = '';
  }
});

formNickname.addEventListener('submit', (e) => {
  e.preventDefault();

  if (nickInput.value) {
    nickname = nickInput.value;
    nickInput.value = '';
    socket.emit('setNicks', nickname);
  }
});

socket.on('message', (msg) => {
  const item = document.createElement('li');
  item.setAttribute(datatest, 'message');
  item.textContent = msg;
  messages.appendChild(item);
});

socket.on('getMessages', (oldMessages) => {
  oldMessages.forEach(({ message, nickname: nick, timestamp }) => {
    const item = document.createElement('li');
    item.setAttribute(datatest, 'message');
    item.textContent = `${timestamp} - ${nick}: ${message}`;
    messages.appendChild(item);
  });
});

const createLiUsers = (users) => {
  listUsers.innerHTML = '';
  const user = document.createElement('li');
  user.setAttribute('data-testid', 'online-user');
  listUsers.appendChild(user);
  user.innerText = nickname;
  users.forEach((element) => {
    if (element !== nickname) {
      const newUser = document.createElement('li');
      newUser.setAttribute(datatest, 'online-user');
      listUsers.appendChild(newUser);
      newUser.innerText = element;
    }
  });
};

socket.on('setNicks', (users) => {
  createLiUsers(Object.values(users));
});

socket.on('disconnectUser', (users) => {
  createLiUsers(Object.values(users));
});
