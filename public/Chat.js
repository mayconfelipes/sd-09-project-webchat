const inputNick = document.querySelector('#nickname-box');
const buttonNick = document.querySelector('#nickname-button');
const inputMsg = document.querySelector('#message-box');
const buttonMsg = document.querySelector('#send-button');

const createRandomNick = () => {
  const cc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const result = [];

  for (let i = 0; i < 16; i += 1) {
    result.push(cc[Math.floor(Math.random() * cc.length)]);
  }

  return result.join('');
};

let userNick = createRandomNick();

const socket = window.io('http://localhost:3000/', { query: { nickname: userNick } });

const createMsg = (message) => {
  const ulMsgs = document.querySelector('#chat-list');
  const liMsg = document.createElement('li');

  liMsg.dataset.testid = 'message';
  liMsg.innerText = message;

  ulMsgs.appendChild(liMsg);
};

buttonMsg.addEventListener('click', (e) => {
  e.preventDefault();

  socket.emit('message', { nickname: userNick, chatMessage: inputMsg.value });

  userNick = '';
  inputMsg.value = '';
  
  return false;
});

const createNewUser = (user) => {
  const ulOlineUsers = document.querySelector('#online-users');
  const liUserOn = document.createElement('li');

  liUserOn.dataset.testid = 'online-user';
  liUserOn.innerText = user;

  ulOlineUsers.appendChild(liUserOn);
};

buttonNick.addEventListener('click', (e) => {
  e.preventDefault();

  userNick = inputNick.value;

  socket.emit('changeUserNick', userNick);

  inputNick.value = '';

  return false;
});

createNewUser(userNick);

socket.on('message', (message) => createMsg(message));

socket.on('onlineUser', (users) => {
  const onlineUsers = document.querySelector('#online-users');

  onlineUsers.innerHTML = '';

  createNewUser(userNick);

  users.forEach((user) => {
    if (user !== userNick) {
      createNewUser(user);
    }
});
});

socket.on('chatHistory', (hist) => 
  hist.forEach((el) => createMsg(el)));