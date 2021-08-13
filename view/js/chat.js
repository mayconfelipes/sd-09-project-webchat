const socket = window.io();

// console.log((Math.random().toString(36).substring(2, 14) + Math.random().toString(36).substring(2, 7)).length);

const formMessages = document.querySelector('#formMessages');
const formNickname = document.querySelector('#formNickname');
const inputMessage = document.querySelector('#messageInput');
const inputNickName = document.querySelector('#nicknameInput');
const usersUl = document.querySelector('#users');
const myNickname = document.querySelector('#myNickname');

const objMessage = {
  chatMessage: '',
  nickname: '',
};

formNickname.addEventListener('submit', (e) => {
  e.preventDefault();
  objMessage.nickname = inputNickName.value;
  socket.emit('nickname', inputNickName.value);
});

formMessages.addEventListener('submit', (e) => {
  e.preventDefault();
  objMessage.chatMessage = inputMessage.value;
  socket.emit('message', objMessage);
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  messagesUl.appendChild(li);
};

const updateNickname = (newNickname, id) => {
  const li = document.querySelector(`#${id}`);
  li.innerText = newNickname;
};

const createLiNickname = (nickname, id) => {
  const li = document.querySelector(`#${id}`);
  if (li) return updateNickname(nickname, id);

  const newLi = document.createElement('li');
  newLi.id = id;
  newLi.innerText = nickname;
  newLi.setAttribute('data-testid', 'online-user');
  usersUl.appendChild(newLi);
};

const insertMyNickname = (nick) => {
  myNickname.innerText = nick;
};

socket.on('message', (message) => createMessage(message));
socket.on('myNickname', (nick) => insertMyNickname(nick));
socket.on('nickname', ({ nickname, id }) => createLiNickname(nickname, id));