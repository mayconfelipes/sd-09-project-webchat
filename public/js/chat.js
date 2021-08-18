const socket = window.io('http://localhost:3000');
const DATA_TEST_ID = 'data-testid';
const USER_LIST = '.user-list';
let nickname = '';
let socketId = '';

function createRandomNickname() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let index = 0; index < 16; index += 1) {
    nickname += characters.charAt(Math.floor(Math.random() * characters.length));
  }
}

function renderUserList(userList) {
  const userUL = document.querySelector(USER_LIST);
  userUL.innerHTML = '';

  userList.forEach(({ userName }) => {
    const li = document.createElement('li');
    li.setAttribute(DATA_TEST_ID, 'online-user');
    li.innerHTML = userName;
    userUL.appendChild(li);
    if (nickname === userName) {
      userUL.insertBefore(li, userUL.firstChild); 
    } 
  });
}

function getMessageList() {
  socket.on('getMessageList', (msgList) => {
    const messageList = document.querySelector('.message-list');
    msgList.forEach((message) => {
      const li = document.createElement('li');
      li.setAttribute(DATA_TEST_ID, 'message');
      li.innerHTML = `${message.timestamp} - ${message.nickname}: ${message.chatMessage}`;
      messageList.appendChild(li);
    });
  });
}

socket.on('updateUserList', (userList) => renderUserList(userList));
socket.on('connection', () => {
  socketId = socket.id;
  createRandomNickname();
  socket.emit('addNickname', { id: socketId, userName: nickname });
  socket.on('updateUserList', (userList) => renderUserList(userList));
  getMessageList();
});

function updateNickname() {
  const btnSaveNickname = document.querySelector('.nickname-button');
  btnSaveNickname.addEventListener('click', () => {
    const nicknameInput = document.querySelector('.nickname-box');
    if (nicknameInput.value) {
      socket.emit('updateNickname', { id: socketId, userName: nicknameInput.value });
      nickname = nicknameInput.value;
      nicknameInput.value = '';
    }
  });
}

function sendMessage() {
  const form = document.querySelector('.form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const messageInput = document.querySelector('.message-box');
  
    if (messageInput.value.length) {
      const messageObj = {
        nickname,
        chatMessage: messageInput.value,
      };
      socket.emit('message', messageObj);
      messageInput.value = '';
    }
  });
}

function getMessage() {
  socket.on('message', (message) => {
    const messageList = document.querySelector('.message-list');
    const li = document.createElement('li');
    li.setAttribute(DATA_TEST_ID, 'message');
    li.innerHTML = message;
    messageList.appendChild(li);
  });
}

window.onbeforeunload = () => {
  socket.disconnect();
};

window.onload = function onload() {
  updateNickname();
  sendMessage();
  getMessage();
};
