const socket = window.io('http://localhost:3000');

const userInput = document.querySelector('.nickname');
const saveUserButton = document.querySelector('.post-nickname');
const messageInput = document.querySelector('.text-message');
const sendMessageButton = document.querySelector('.post-message');

const addNewUser = (userName) => {
  const userList = document.querySelector('.user-list');

  const newUserElement = document.createElement('li');
  newUserElement.innerText = userName;

  userList.appendChild(newUserElement);
};

saveUserButton.addEventListener('click', (e) => {
  e.preventDefault();

  const newUser = userInput.value;

  socket.emit('newUser', newUser);

  userInput.value = '';
  return false;
});

socket.on('addNewUser', addNewUser);

let currentUser = '';

socket.on('userName', (userName) => {
  currentUser = userName;
});

sendMessageButton.addEventListener('click', (e) => {
  e.preventDefault();

  const message = messageInput.value;

  socket.emit('message', { chatMessage: message, nickname: currentUser });

  messageInput.value = '';
  return false;
});

const addNewMessage = (message) => {
  const messageList = document.querySelector('.message-list');

  const newMessageElement = document.createElement('li');
  newMessageElement.innerText = message;

  messageList.appendChild(newMessageElement);
};

socket.on('message', addNewMessage);
