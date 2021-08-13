const socket = window.io();

const sendButton = document.querySelector('#send-button');
const inputMessage = document.querySelector('#messageInput');
const usersUl = document.querySelector('.users');
// const nickname = document.querySelector('.users');
sendButton.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: inputMessage.value, 
    nickname: usersUl.firstChild.innerText });
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  messagesUl.prepend(li);
};
const createUser = (id) => {
  const li = document.createElement('li');
  li.innerText = id;
  usersUl.appendChild(li);
};

socket.on('message', (message) => createMessage(message));
socket.on('newUser', ({ id }) => createUser(id));