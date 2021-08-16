const socket = window.io();

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

const dataTestId = 'data-testid';

formNickname.addEventListener('submit', (e) => {
  e.preventDefault();
  objMessage.nickname = inputNickName.value;
  socket.emit('nickname', inputNickName.value);
});

formMessages.addEventListener('submit', async (e) => {
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
  li.setAttribute(dataTestId, 'message');
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
  newLi.setAttribute(dataTestId, 'online-user');
  usersUl.appendChild(newLi);
};

const insertMyNickname = (nick) => {
  myNickname.innerText = nick;
};

const loadLastMessages = (messages) => {
  const messagesUl = document.querySelector('#messages');
  messages.forEach(({ nickname, timestamp, message }) => {
    const li = document.createElement('li');
    const lastMessage = `${timestamp} - ${nickname}: ${message}`;
    li.innerText = lastMessage;
    li.setAttribute(dataTestId, 'message');
    messagesUl.appendChild(li);
  });
};

socket.on('message', (message) => createMessage(message));
socket.on('myNickname', (nick) => insertMyNickname(nick));
socket.on('nickname', ({ nickname, id }) => createLiNickname(nickname, id));
socket.on('getMessages', ({ messages }) => loadLastMessages(messages));