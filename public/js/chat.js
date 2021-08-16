const socket = window.io('http://localhost:3000');

function addUserInList(userName) {
  const userList = document.querySelector('.user-list');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'online-user');
  li.innerHTML = userName;
  userList.appendChild(li);
  if (userList.childNodes.length > 1) userList.firstChild.remove();
}

function createRandomNickname() {
  let nicknameRandom = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let index = 0; index < 16; index += 1) {
    nicknameRandom += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  addUserInList(nicknameRandom);
}

const btnSaveNickname = document.querySelector('.nickname-button');
btnSaveNickname.addEventListener('click', () => {
  const nicknameBox = document.querySelector('.nickname-box');
  if (nicknameBox.value) {
    addUserInList(nicknameBox.value);
    nicknameBox.value = '';
  }
  
});
  
const form = document.querySelector('.form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const messageBox = document.querySelector('.message-box');
  const userList = document.querySelector('.user-list');
  
  if (messageBox.value.length) {
    const messageObj = {
      nickname: userList.lastChild.innerHTML,
      chatMessage: messageBox.value,
    };
    socket.emit('message', messageObj);
    messageBox.value = '';
  }
});

socket.on('message', (message) => {
  const messageList = document.querySelector('.message-list');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerHTML = message;
  messageList.appendChild(li);
});

socket.on('newConnection', (msgList) => {
  const messageList = document.querySelector('.message-list');
  msgList.forEach((message) => {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'message');
    li.innerHTML = `${message.timestamp} - ${message.nickname}: ${message.chatMessage}`;
    messageList.appendChild(li);
  });
});

window.onload = function onload() {
  createRandomNickname();
};
