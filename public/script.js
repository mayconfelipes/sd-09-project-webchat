const socket = window.io();

const inputNickname = document.querySelector('.input-nickname');
const nicknameButton = document.querySelector('.nickname-btn');
const userList = document.querySelector('.user-list');
const messages = document.querySelector('.messages');
const inputChat = document.querySelector('.input-chat');
const sendButton = document.querySelector('.send-btn');

const datatestid = 'data-testid';

let userNickname = `user-${Math.random().toString().slice(2, 13)}`;

const renderUserList = () => {
  const li = document.createElement('li');
  li.setAttribute(datatestid, 'online-user');
  li.textContent = userNickname;
  userList.appendChild(li);
};
renderUserList();

const changeUserNickname = (event) => {
  event.preventDefault();
  if (inputNickname.value) {
    userNickname = inputNickname.value;
    userList.innerHTML = '';
    renderUserList();
  }
  inputNickname.value = '';
};
inputNickname.addEventListener('submit', changeUserNickname);
nicknameButton.addEventListener('click', changeUserNickname);

const sendMessages = (event) => {
  event.preventDefault();
  if (inputChat.value) {
    socket.emit('message', {
      chatMessage: inputChat.value,
      nickname: userNickname,
    });
  }
  inputChat.value = '';
};
inputChat.addEventListener('submit', sendMessages);
sendButton.addEventListener('click', sendMessages);

const renderMessagesHistory = (messagesHistory) => {
  messagesHistory.forEach(({ message, nickname, timestamp }) => {
    const li = document.createElement('li');
    li.setAttribute(datatestid, 'message');
    li.textContent = `${timestamp} - ${nickname}: ${message}`;
    messages.appendChild(li);
  });
};

socket.on('message', (msg) => {
  const li = document.createElement('li');
  li.setAttribute(datatestid, 'message');
  li.textContent = msg;
  messages.appendChild(li);
});

socket.on('connect', () => {
  fetch('http://localhost:3000/history')
    .then((response) => response.json())
    .then((result) => renderMessagesHistory(result));
});
