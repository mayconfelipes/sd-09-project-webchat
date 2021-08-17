const socket = window.io();

socket.emit('updateUsersList');

const createListItem = (parent, innerText, dataTestId = '') => {
  const listItem = document.createElement('li');
  listItem.innerText = innerText;
  listItem.dataset.testid = dataTestId;
  parent.appendChild(listItem);
};

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
  const messageList = document.querySelector('#message-list');
  createListItem(messageList, message, 'message');
});

socket.on('updateUsersList', (users) => {
  localStorage.setItem(socket.id, users[socket.id]);
  const localUser = users[socket.id];
  const usersCopy = { ...users };
  delete usersCopy[socket.id];

  const usersList = document.querySelector('#users-list');
  usersList.innerHTML = '';

  createListItem(usersList, localUser, 'online-user');
  Object.keys(usersCopy).forEach((user) => (
    createListItem(usersList, usersCopy[user], 'online-user')
  ));
});

window.onbeforeunload = () => {
  localStorage.removeItem(socket.id);
  socket.disconnect();
};
