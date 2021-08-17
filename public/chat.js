const socket = window.io();

const sendButton = document.querySelector('#send-button');
const nicknameButton = document.querySelector('#nickname-button');
const inputMessage = document.querySelector('#messageInput');
const inputNickname = document.querySelector('#nickname-box');
const usersUl = document.querySelector('.users');
// const nickname = document.querySelector('.users');
sendButton.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: inputMessage.value, 
    nickname: usersUl.firstChild.innerText });
  inputMessage.value = '';
  return false;
});

nicknameButton.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('newNickname', { newNickname: inputNickname.value });
  // usersUl.firstChild.innerText = inputNickname.value;
  inputNickname.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message'); 
  messagesUl.appendChild(li);
};

const populateUsers = (array, id) => {
  usersUl.innerHTML = null;
  if (!sessionStorage.getItem('socket')) sessionStorage.setItem('socket', id);
  array.forEach((item) => {
    const li = document.createElement('li');
    li.innerText = item.nickname;
    li.setAttribute('data-testid', 'online-user');
    if (sessionStorage.getItem('socket') !== item.socketId) {
      usersUl.appendChild(li);
    } else {
      usersUl.prepend(li);
    }
  });
};

socket.on('message', (message) => createMessage(message));
socket.on('newUser', ({ connectedUsers, id }) => populateUsers(connectedUsers, id));
socket.on('users', ({ connectedUsers, id }) => populateUsers(connectedUsers, id));