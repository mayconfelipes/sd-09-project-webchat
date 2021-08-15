const socket = window.io();

const DATATEST = 'data-testid';
const messages = document.querySelector('.messages');
const chatInput = document.querySelector('.chat-input');
const sendButton = document.querySelector('.send-button');
const userList = document.querySelector('.user-list');
const nameInput = document.querySelector('.name-input');
const nameButton = document.querySelector('.name-button');
const userName = `User-${Math.random().toString().slice(2, 13)}`;
let newName = '';

const renderUserList = (array) => {
  userList.innerHTML = '';
    array.forEach((element) => {
      const user = document.createElement('li');
      user.textContent = element.userName;
      user.setAttribute(DATATEST, 'online-user');
      if (element.userName === userName) {
        userList.insertBefore(user, userList.firstChild);
      } else if (element.userName === newName) {
        userList.insertBefore(user, userList.firstChild);
      } else {
        userList.appendChild(user);
      }
    });
};

const changeName = (e) => {
  e.preventDefault();
  if (nameInput.value) {
    newName = nameInput.value;
    const newNameSchema = { old: userName, new: nameInput.value };
    socket.emit('updateUserName', newNameSchema);
    socket.on('updateUserName', (list) => {
      renderUserList(list);
    });
    nameInput.value = '';
  }
};

const sendMessage = (e) => {
  e.preventDefault();
  const obj = { chatMessage: chatInput.value, nickname: userName };
  if (chatInput.value) {
    socket.emit('message', obj);
    chatInput.value = '';
    messages.scrollIntoView(false);
  }
};

sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('submit', sendMessage);
nameButton.addEventListener('click', changeName);
nameInput.addEventListener('submit', changeName);

socket.on('message', (msg) => {
  const message = document.createElement('li');
  message.textContent = msg;
  message.setAttribute(DATATEST, 'message');
  messages.appendChild(message);
  messages.scrollIntoView(false);
});

const renderMessage = (msgs) => {
  msgs.forEach((element) => {
    const message = document.createElement('li');
    message.setAttribute(DATATEST, 'message');
    message.textContent = `${element.timestamp} ${element.nickname}: ${element.message}`;
    messages.appendChild(message);
  });
};

socket.on('connect', () => {
  fetch('http://localhost:3000/history')
    .then((res) => res.json())
    .then((chat) => renderMessage(chat));
  socket.emit('createUser', userName);
  });
socket.on('userListConnect', (arr) => {
  renderUserList(arr);
});
socket.on('updateListDisconnect', (usersList) => {
  userList.innerHTML = '';
  renderUserList(usersList);
});
