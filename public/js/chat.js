const socket = window.io();

window.onload = () => {
  socket.emit('newUser');
};

const formUser = document.querySelector('#chatUser');
const inputNickname = document.querySelector('#nickname-box');

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

const addUser = (userList) => {
  const nicknamesList = document.querySelector('#nickname-list');
  nicknamesList.innerHTML = '';

  userList.map((user) => {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'online-user');
    const nick = user[1];
    li.className = nick;
    li.innerText = nick;
    nicknamesList.appendChild(li);
    return 0;
  });
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

socket.on('newUser', (userList) => addUser(userList));

socket.on('changeName', (userList) => addUser(userList));

socket.on('online', (userList) => {
  const userId = userList[userList.length - 1];
  userList.pop();
  const newList = [userId, ...userList];
  addUser(newList);
});

socket.on('offline', (userList) => addUser(userList));
