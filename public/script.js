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

const appendMessage = (message) => {
  const li = document.createElement('li');
  li.innerHTML = message;
  li.dataset.testid = 'message';
  messagesList.append(li);
};

client.on('message', (formattedMsg) => appendMessage(formattedMsg));

client.on('showAllMsgs', (allMsgs) => {
  allMsgs.forEach(({ message, nickname: nick, timestamp }) => {
    const formattedMsg = `${timestamp} - ${nick}: ${message}`;
    appendMessage(formattedMsg);
  });
});

const appendNickname = (nick) => {
  const li = document.createElement('li');
    li.innerHTML = nick;
    li.dataset.testid = 'online-user';
    nicknamesList.append(li);
};

client.on('listUsers', (usersList) => {
  nicknamesList.innerHTML = '';
  if (!nickname) { nickname = usersList[usersList.length - 1]; }
  appendNickname(nickname);
  const otherUsers = usersList.filter((user) => user !== nickname);
  otherUsers.forEach((user) => appendNickname(user));
});
