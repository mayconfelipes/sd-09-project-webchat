const socket = window.io();

socket.emit('updateUsersList');

const nicaknameButton = document.querySelector('#nickname-button');
const sendButton = document.querySelector('#send-button');

nicaknameButton.addEventListener('click', (e) => {
  e.preventDefault();
  const nicknameBox = document.querySelector('#nickname-box');
  socket.emit('updateUsersList', nicknameBox.value);
  nicknameBox.value = '';
});

sendButton.addEventListener('click', (e) => {
  e.preventDefault();
  const messageBox = document.querySelector('#message-box');
  const nickname = localStorage.getItem(socket.id);
  socket.emit('message', { chatMessage: messageBox.value, nickname });
  messageBox.value = '';
});

// Sockets events
socket.on('message', (message) => {
  const newMessage = document.createElement('li');
  newMessage.innerText = message;
  newMessage.dataset.testid = 'message';

  const messageList = document.querySelector('#message-list');
  messageList.appendChild(newMessage);
});

socket.on('updateUsersList', (users) => {
  localStorage.setItem(socket.id, users[socket.id]);

  const usersList = document.querySelector('#users-list');
  usersList.innerHTML = '';

  Object.keys(users).forEach((user) => {
    const onlineUser = document.createElement('li');
    onlineUser.innerText = users[user];
    onlineUser.dataset.testid = 'online-user';
    usersList.appendChild(onlineUser);
  });
});

window.onbeforeunload = () => {
  localStorage.removeItem(socket.id);
  socket.disconnect();
};
