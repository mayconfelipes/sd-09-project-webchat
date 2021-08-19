const socket = window.io();

const inputNickname = document.querySelector('.input-nickname');
const nicknameButton = document.querySelector('.nickname-btn');
const userList = document.querySelector('.user-list');
const messages = document.querySelector('.messages');
const inputChat = document.querySelector('.input-chat');
const sendButton = document.querySelector('.send-btn');

let nickname = `user-${Math.random().toString().slice(2, 13)}`;

const renderUserList = () => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'online-user');
  li.textContent = nickname;
  userList.appendChild(li);
};
renderUserList();

const changeUserNickname = (event) => {
  event.preventDefault();
  if (inputNickname.value) {
    nickname = inputNickname.value;
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
      nickname,
    });
  }
  inputChat.value = '';
};
inputChat.addEventListener('submit', sendMessages);
sendButton.addEventListener('click', sendMessages);

socket.on('message', (msg) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.textContent = msg;
  messages.appendChild(li);
});
