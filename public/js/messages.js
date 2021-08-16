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

const createUser = (nickname) => {
  const usersUl = document.querySelector('.users-list');
  const li = document.createElement('li');
  li.innerText = nickname;
  li.setAttribute('data-testid', 'online-user');
  usersUl.appendChild(li);
};

const updateUser = (oldNickname, newNickname) => {
  const usersUl = document.querySelector('.users-list');
  const users = usersUl.querySelectorAll('li');
  let user = null;

  for (let i = 0; i < users.length; i += 1) {
    if (users[i].textContent === oldNickname) {
      user = users[i];
      break;
    }
  }

  user.innerText = newNickname;
};

socket.on('connect', () => {
  sessionStorage.setItem(socket.id, generateNickname());
  socket.emit('newConnection', sessionStorage.getItem(socket.id));
});

socket.on('newConnection', (nickname) => createUser(nickname));
socket.on('updateNickname', ({ oldNickname, newNickname }) => updateUser(oldNickname, newNickname));

socket.on('message', (message) => createMessage(message));