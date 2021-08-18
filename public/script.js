const client = window.io();

const messageBox = document.querySelector('#message-box');
const messageBtn = document.querySelector('#send-button');
const messagesList = document.querySelector('#messages');
const nicknameBox = document.querySelector('#nickname-box');
const nicknameBtn = document.querySelector('#nickname-button');
const nicknamesList = document.querySelector('#users-list');

let nickname = '';

messageBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (messageBox.value) {
    if (!nickname) { nickname = client.id.substring(0, 16); }
    const msgObject = { chatMessage: messageBox.value, nickname };
    client.emit('message', msgObject);
    messageBox.value = '';
  }
});

nicknameBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (nicknameBox.value) {
    nickname = nicknameBox.value;
    client.emit('nicknameChange', nickname);
    nicknameBox.value = '';
  }
});

client.on('message', (formattedMsg) => {
  const li = document.createElement('li');
  li.innerHTML = formattedMsg;
  li.dataset.testid = 'message';
  messagesList.append(li);
});

client.on('listUsers', (usersList) => {
  nicknamesList.innerHTML = '';
  usersList.forEach((user) => {
    const li = document.createElement('li');
    li.innerHTML = user;
    li.dataset.testid = 'online-user';
    nicknamesList.append(li);
  });
});
