const socket = window.io();
      
const sendMsg = () => {
  const inputMsg = document.querySelector('#msg-text');
  const nickname = document.querySelector('#nickname');
  socket.emit('message', {
    chatMessage: inputMsg.value,
    nickname: nickname.innerText,
  });
  inputMsg.value = '';
};

const createMsg = (msg) => {
  const ul = document.querySelector('.messages');
  const li = document.createElement('li');
  li.innerText = msg;
  li.dataset.testid = 'message';
  ul.appendChild(li);
};

const getRandomNickname = () => {
  const letters = 'abcdefghijklmnopqrstuvxwyz';
  const stringLength = 16;
  let nickname = '';
  for (let index = 0; index < stringLength; index += 1) {
    nickname += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return nickname;
};

const getNickname = () => {
  const nickname = document.querySelector('#nickname');
  const randomNickname = getRandomNickname();
  socket.emit('loadUsers', randomNickname);
  nickname.innerText = randomNickname;
};

const changeNickname = () => {
  const inputNickname = document.querySelector('#nickname-input');
  const nickname = document.querySelector('#nickname');
  const onlineUsers = document.querySelectorAll('.user');
  onlineUsers.forEach((user) => {
    if (user.innerText === nickname.innerText) {
      socket.emit('changeNickname', {
        newNickname: inputNickname.value,
        oldNickname: user.innerText,
      });
    }
  });
  nickname.innerText = inputNickname.value;
};

const loadUser = (user) => {
  const ul = document.querySelector('.users');
  const li = document.createElement('li');
  const nickname = document.querySelector('#nickname');
  li.dataset.testid = 'online-user';
  li.className = 'user';
  li.innerText = user;
  if (user === nickname.innerText) {
    ul.insertBefore(li, ul.firstChild);
    return;
  }
  ul.appendChild(li);
};

socket.on('message', (msg) => createMsg(msg));

socket.on('loadUsers', (users) => {
  const onlineUsers = Array.from(document.querySelectorAll('.user'));
  onlineUsers.forEach((user) => user.remove());
  users.forEach(loadUser);
});

window.onload = () => {
  const changeBtn = document.querySelector('#change-btn');
  const sendBtn = document.querySelector('#send-btn');

  changeBtn.addEventListener('click', changeNickname);
  sendBtn.addEventListener('click', sendMsg);

  socket.emit('loadMessages');

  getNickname();
};

window.onbeforeunload = () => {
  socket.disconnect();
};
