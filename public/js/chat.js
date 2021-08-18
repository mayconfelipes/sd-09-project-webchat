const socket = window.io();

const messageForm = document.querySelector('#message-form');
const userForm = document.querySelector('#user-form');
const messageInput = document.querySelector('#messageInput');
const nickNameInput = document.querySelector('#nickNameInput');
const messagesField = document.querySelector('#messages');
const onlineUsersField = document.querySelector('#online-users');
const testId = 'data-testid';

let nickname = '';

const setNickname = (string) => {
  const userNick = document.createElement('li');
  userNick.innerText = string;
  userNick.setAttribute(testId, 'online-user');
  onlineUsersField.appendChild(userNick);
  localStorage.setItem(`${socket.id}`, string);
};

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  socket.emit('message', { chatMessage: messageInput.value, nickname });
  messageInput.value = '';
});

userForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const userNickname = nickNameInput.value;
  nickname = userNickname;
  localStorage.setItem(`${socket.id}`, userNickname);
  socket.emit('nickname', userNickname);
  nickNameInput.value = '';
});

socket.on('newConnection', (chatHistory) => {
  chatHistory.forEach((msg) => {
    const msgItem = document.createElement('li');
    msgItem.setAttribute(testId, 'message');
    msgItem.innerText = msg;
    messagesField.appendChild(msgItem);
  });
});

socket.on('updateOnlineUsers', (users) => {
  onlineUsersField.innerHTML = '';
  if (!nickname) {
    nickname = users[users.length - 1];
  }

  setNickname(nickname);
  const otherUsers = users.filter((user) => user !== nickname);
  otherUsers.forEach((user) => {
    setNickname(user);
  });
});

socket.on('message', (message) => {
  const incomingMessage = document.createElement('li');
  incomingMessage.setAttribute(testId, 'message');
  incomingMessage.innerText = message;
  messagesField.appendChild(incomingMessage);
});
