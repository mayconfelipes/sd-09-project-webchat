const socket = window.io();

const DATATEST = 'data-testid';
const messages = document.querySelector('.messages');
const chatInput = document.querySelector('.chat-input');
const sendButton = document.querySelector('.send-button');
const userList = document.querySelector('.user-list');
const nameInput = document.querySelector('.name-input');
const nameButton = document.querySelector('.name-button');
let userName = `User-${Math.random().toString().slice(2, 13)}`;

userList.textContent = userName;

const changeName = (e) => {
  e.preventDefault();
  if (nameInput.value) {
    userName = nameInput.value;
    userList.textContent = userName;
    nameInput.value = '';
  }
};

const sendMessage = (e) => {
  e.preventDefault();
  const obj = { chatMessage: chatInput.value, nickname: userName };
  if (chatInput.value) {
    socket.emit('message', obj);
    chatInput.value = '';
  }
};

sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('submit', sendMessage);
nameButton.addEventListener('click', changeName);
nameInput.addEventListener('submit', changeName);

socket.on('message', (msg) => {
  const message = document.createElement('li');
  message.textContent = msg;
  message.setAttribute(DATATEST, 'message');
  messages.appendChild(message);
});

const renderMessage = (msgs) => {
  msgs.forEach((element) => {
    const message = document.createElement('li');
    message.setAttribute(DATATEST, 'message');
    message.textContent = `${element.timestamp} ${element.nickname}: ${element.message}`;
    messages.appendChild(message);
  });
};

socket.on('connect', () => {
  fetch('http://localhost:3000/history')
    .then((res) => res.json())
    .then((chat) => renderMessage(chat));
});
