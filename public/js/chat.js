const socket = window.io();

const messageForm = document.querySelector('#message-form');
const userForm = document.querySelector('#user-form');
const messageInput = document.querySelector('#messageInput');
const nickNameInput = document.querySelector('#nickNameInput');
const messagesField = document.querySelector('#messages');
const userNameField = document.querySelector('#online-users');
const onlineUsersField = document.querySelector('#online-users');
const testId = 'data-testid';

// https://www.codegrepper.com/code-examples/javascript/how+to+generate+random+string+in+javascript

const getRandomString = (length) => {
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
};

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const storeNickname = localStorage.getItem(`${socket.id}`);

  socket.emit('message', { chatMessage: messageInput.value, nickname: storeNickname });
  messageInput.value = '';
});

userForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const userNickname = nickNameInput.value;
  userNameField.firstElementChild.innerText = userNickname;
  localStorage.setItem(`${socket.id}`, userNickname);
  socket.emit('nickname', userNickname);
  nickNameInput.value = '';
});

socket.on('newConnection', (chatHistory) => {
  chatHistory.forEach((msg) => {
    const msgItem = document.createElement('li');
    msgItem.setAttribute(testId, 'message');
    msgItem.innerText = msg;
    messagesField.appendChild(msgItem);
  });

  // connectedUsers.forEach((user) => {
  //   const connUser = document.createElement('li');
  //   connUser.innerText = user;
  //   onlineUsersField.appendChild(connUser);
  // });

  const newNickName = getRandomString(16);
  localStorage.setItem(`${socket.id}`, newNickName);
  const me = document.createElement('li');
  me.setAttribute(testId, 'online-user');
  me.setAttribute('id', 'online-user');
  me.innerText = newNickName;
  onlineUsersField.appendChild(me);
  socket.emit('userConnected', newNickName);
});

socket.on('userConnected', (userNick) => {
  const newUser = document.createElement('li');
  newUser.innerText = userNick;
  onlineUsersField.appendChild(newUser);
});

socket.on('message', (message) => {
  const incomingMessage = document.createElement('li');
  incomingMessage.setAttribute(testId, 'message');
  incomingMessage.innerText = message;
  messagesField.appendChild(incomingMessage);
});

// socket.on('userConnected', (nick) => {
//   const newUser = document.createElement('li');
//   newUser.innerText = nick;
//   onlineUsersField.appendChild(newUser);
// });
