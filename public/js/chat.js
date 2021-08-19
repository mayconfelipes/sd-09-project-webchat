const socket = window.io();
const sendMessage = document.querySelector('#send-button');
const messageInput = document.querySelector('#message-box');
const messageList = document.querySelector('#messageList');
const boxNickName = document.querySelector('#nickname-box');
const saveNickname = document.querySelector('#nickname-button');
const onlineUsersList = document.querySelector('#online-users');

const createMessage = (message) => {
  const li = document.createElement('li');
  li.dataset.testid = 'message';
  li.innerText = message;
  messageList.append(li);
};

let nickname = null;

const createNewUser = (name) => {
  const li = document.createElement('li');
  li.innerText = name;
  li.dataset.testid = 'online-user';
  li.className = 'user-nickname';
  onlineUsersList.appendChild(li);
  console.log(document.querySelector('.user-nickname'));
};

saveNickname.addEventListener('click', (e) => {
  e.preventDefault();
  nickname = boxNickName.value;
  document.querySelector('.user-nickname').innerText = nickname;

  socket.emit('updateNickname', nickname);
});

sendMessage.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: messageInput.value, nickname });
  messageInput.value = '';
});

socket.on('messageHistory', (obj) => {
  nickname = obj.nickname;
  obj.messageHistory.forEach(createMessage);
});
socket.on('message', createMessage);
socket.on('updateUserList', (updatedList) => {
  [...onlineUsersList.children].forEach((elem) => elem.remove());
  createNewUser(nickname);
  updatedList.forEach((user) => {
    if (user !== nickname) createNewUser(user);
  });
});