const io = window.io();
const messageInput = document.querySelector('#message-input');
const messageButton = document.querySelector('#send-message');
const messages = document.querySelector('.messages');
const nicknameInput = document.querySelector('#nickname');
const saveNicknameButton = document.querySelector('#save-nickname');
const users = document.querySelector('#users');
let nickname = null;

messageButton.addEventListener('click', (event) => {
  event.preventDefault();
  io.emit('message', { chatMessage: messageInput.value, nickname });
  messageInput.value = '';
});

saveNicknameButton.addEventListener('click', (event) => {
  event.preventDefault();
  nickname = nicknameInput.value;
  io.emit('changeNickname', nickname);
});

const createMessage = (message) => {
  const li = document.createElement('li');
  li.textContent = message;
  li.dataset.testid = 'message';
  messages.appendChild(li);
};

const createUser = (user) => {
  const li = document.createElement('li');
  li.textContent = user;
  li.dataset.testid = 'online-user';
  users.appendChild(li);
};

io.on('init', (data) => {
  nickname = data.nickname;
  data.history.forEach((message) => createMessage(message));
});

io.on('message', createMessage);

io.on('updateUsers', (updatedList) => {
  [...users.children].forEach((elem) => elem.remove());
  createUser(nickname);
  updatedList.forEach((user) => {
    if (user !== nickname) createUser(user);
  });
});
