const socket = window.io();
// função io é uma função injetada ao objeto window do DOM da página

const messageBtn = document.querySelector('#messageBtn');
const userNickname = document.querySelector('#nickname');
const messageInput = document.querySelector('#message');
const msgContainer = document.querySelector('#msgContainer');

messageBtn.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: messageInput.value, nickname: userNickname });
  messageInput.value = '';
  return false;
});

const addMessage = (message) => {
  const msg = document.createElement('p');
  msg.setAttribute('data-testid', 'message');
  msg.innerText = message;
  msgContainer.appendChild(msg);
};

const createResponse = (response) => {
  const user = document.querySelector('#user');
  const nick = document.createElement('span');
  nick.setAttribute('id', 'nickname');
  nick.setAttribute('data-testid', 'online-user');
  nick.innerText = response;
  user.appendChild(nick);
};

socket.on('connected', (res) => createResponse(res));
socket.on('message', (message) => addMessage(message));
