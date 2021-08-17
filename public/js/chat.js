const socket = window.io();

const messageForm = document.querySelector('#message-form');
const userForm = document.querySelector('#user-form');
const messageInput = document.querySelector('#messageInput');
const nickNameInput = document.querySelector('#nickNameInput');
const messagesField = document.querySelector('#messages');
const userNameField = document.querySelector('#online-user');

// https://www.codegrepper.com/code-examples/javascript/how+to+generate+random+string+in+javascript

const getRandomString = (length) => {
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
};

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const storeNickname = localStorage.getItem(`${socket.id}`);

  socket.emit('message', { chatMessage: messageInput.value, nickname: storeNickname });
  messageInput.value = '';
});

userForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const userNickname = nickNameInput.value;
  userNameField.innerText = userNickname;
  localStorage.setItem(`${socket.id}`, userNickname);
  socket.emit('nickname', userNickname);
  nickNameInput.value = '';
  return false;
});

socket.on('newConnection', () => {
  // e.preventDefault();

  const newNickName = getRandomString(16);
  localStorage.setItem(`${socket.id}`, newNickName);
  userNameField.innerText = `${newNickName}`;
});

socket.on('message', (message) => {
  const incomingMessage = document.createElement('li');
  incomingMessage.setAttribute('data-testid', 'message');
  incomingMessage.innerText = message;
  messagesField.appendChild(incomingMessage);
});