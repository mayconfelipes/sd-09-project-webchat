const socket = window.io();

const messageForm = document.querySelector('.send-message-form');
const inputMessage = document.querySelector('.send-message-input');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const chatMessage = inputMessage.value;
  const nickname = sessionStorage.getItem(socket.id);
  socket.emit('message', { chatMessage, nickname });
  inputMessage.value = '';
  return false;
});

const nicknameForm = document.querySelector('.nickname-form');
const inputNickname = document.querySelector('.nickname-input');

nicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newNickname = inputNickname.value;
  const oldNickname = sessionStorage.getItem(socket.id);
  sessionStorage.setItem(socket.id, newNickname);
  socket.emit('updateNickname', { oldNickname, newNickname });
});

const generateNickname = () => {
  let string = '';
  const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i += 1) {
      string += char.charAt(Math.floor(Math.random() * char.length));
  }
  return string;
};

const createMessage = (message) => {
  const messagesUl = document.querySelector('.messages-container');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  messagesUl.appendChild(li);
};

const cleanUsers = () => {
  const usersUl = document.querySelector('.users-list');
  usersUl.innerHTML = '';
};

const createUser = (nickname) => {
  const usersUl = document.querySelector('.users-list');
  const li = document.createElement('li');
  li.innerText = nickname;
  li.setAttribute('data-testid', 'online-user');
  usersUl.appendChild(li);
};

const updateUser = (connections) => {
  cleanUsers();
  connections.forEach((item) => {
    if (item.socketId === socket.id) return createUser(item.nickname);
    return null;
  });
  connections.forEach((item) => {
    if (item.socketId === socket.id) return null;
    return createUser(item.nickname);
  });
};

socket.on('connect', () => {
  sessionStorage.setItem(socket.id, generateNickname());
  socket.emit('newConnection', sessionStorage.getItem(socket.id));
});

socket.on('newConnection', (connections) => updateUser(connections));

socket.on('updateNickname', (connections) => updateUser(connections));

socket.on('message', (message) => createMessage(message));