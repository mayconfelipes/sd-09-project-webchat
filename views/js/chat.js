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

const randomNickname = () => {
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
  nickname.innerText = randomNickname();
};

const changeNickname = () => {
  const inputNickname = document.querySelector('#nickname-input');
  const nickname = document.querySelector('#nickname');
  nickname.innerText = inputNickname.value;
};

socket.on('message', (msg) => createMsg(msg));

window.onload = () => {
  const changeBtn = document.querySelector('#change-btn');
  const sendBtn = document.querySelector('#send-btn');

  changeBtn.addEventListener('click', changeNickname);
  sendBtn.addEventListener('click', sendMsg);

  socket.emit('onload');

  getNickname();
};
