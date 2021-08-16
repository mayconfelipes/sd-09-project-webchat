const socket = window.io();

const enterButton = document.querySelector('#enter-button');
const sendButton = document.querySelector('#send-button');

enterButton.addEventListener('click', (e) => {
  e.preventDefault();
  const nicknameInput = document.querySelector('#nickname-input');
  socket.emit('welcomeUser', nicknameInput.value);
  nicknameInput.value = '';
});

sendButton.addEventListener('click', () => {
  const messageInput = document.querySelector('#message-input');
  socket.emit('message', { chatMessage: messageInput.value, nickname: 'ihj' });
  messageInput.value = '';
});

socket.on('message', (message) => {
  const newMessage = document.createElement('li');
  newMessage.innerText = message;
  newMessage.dataset.testid = 'message';

  const messageList = document.querySelector('#message-list');
  messageList.appendChild(newMessage);
});

window.onbeforeunload = () => socket.disconnect();
