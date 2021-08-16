const socket = window.io();

window.onload = () => {
  socket.emit('newUser');
};

const formUser = document.querySelector('#chatUser');
const inputNickname = document.querySelector('#nickname-box');
const nicknamesList = document.querySelector('#nickname-list');

let userName = '';

formUser.addEventListener('submit', (event) => {
  event.preventDefault();
  const nickname = inputNickname.value;
  localStorage.setItem('nickname', nickname);

  userName = nickname;
  socket.emit('changeName', nickname);
});

const formChat = document.querySelector('#chatForm');
const inputMessage = document.querySelector('#message-box');

formChat.addEventListener('submit', (event) => {
  event.preventDefault();
  const chatMessage = inputMessage.value;
  const nickname = userName;
  socket.emit('message', { chatMessage, nickname });
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
  return 0;
};

const addUser = async (user) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'online-user');
  li.className = user;
  li.innerText = user;
  nicknamesList.appendChild(li);
  return null;
};

socket.on('restoreChat', (messageList) => {
  if (!messageList) return 0;
  console.log(messageList);
  document.querySelector('#messages').innerHTML = '';
  messageList.map(({ message, nickname, timestamp }) => createMessage(
    `${timestamp} ${nickname}: ${message}`,
    ));
});

socket.on('message', (message) => createMessage(message));

socket.on('newUser', (userList) => {
  nicknamesList.innerHTML = '';
  userList.map((user) => addUser(user[1]));
  return 0;
});

socket.on('changeName', (userList) => {
  nicknamesList.innerHTML = '';
  userList.map((user) => addUser(user[1]));
});

socket.on('online', (userList) => {
  nicknamesList.innerHTML = '';
  const userId = userList[userList.length - 1];
  userList.pop();
  const newList = [userId, ...userList];
  newList.map((user) => addUser(user[1]));
  return 0;
});

socket.on('offline', (userList) => {
  nicknamesList.innerHTML = '';
  userList.map((user) => addUser(user[1]));
});
