const socket = window.io();

const addNewUserBtn = document.querySelector('.newUserBtn');
const sendBtn = document.querySelector('.sendBtn');

let nickname = '';

socket.emit('userStart');

const createNewUser = (userName) => {
  const newUser = document.createElement('li');
  newUser.className = 'user';
  newUser.innerHTML = userName;
  newUser.setAttribute('data-testid', 'online-user');
  return newUser;
};

const createNewMessage = (message) => {
  const messageElement = document.createElement('li');
  messageElement.innerHTML = message;
  messageElement.setAttribute('data-testid', 'message');
  return messageElement;
};

socket.on('onlineUser', (usersList) => {
  Object.values(usersList).forEach((user) => {
    const usersUl = document.querySelector('.usersList');
    usersUl.appendChild(createNewUser(user));
  });
});

addNewUserBtn.addEventListener('click', () => {
  const userInput = document.querySelector('.newUserInput');
  socket.emit('newUser', userInput.value);
  userInput.value = '';
});

socket.on('updateName', (name) => {
  nickname = name;
});

socket.on('updateUsers', (usersList) => {
  const usersUl = document.querySelector('.usersList');
  usersUl.innerHTML = '';
  const firstUser = Object.keys(usersList).find((user) => user === socket.id.toString());
  const users = Object.values(usersList).filter((user) => user !== usersList[firstUser]);
  const list = [usersList[firstUser], ...users];
  list.forEach((user) => {
    usersUl.appendChild(createNewUser(user));
  });
});

// enviar menssagem
sendBtn.addEventListener('click', () => {
  const inputMessage = document.querySelector('.messageInput');
  const chatMessage = inputMessage.value;
  socket.emit('message', { chatMessage, nickname });
  inputMessage.value = '';
});

// receber messagem
socket.on('message', (message) => {
  const messagesList = document.querySelector('.webChat');
  messagesList.appendChild(createNewMessage(message));
});

// imprime log de menssagens
socket.on('printChatLog', (messagesLog) => {
  const messagesList = document.querySelector('.webChat');
  messagesLog.forEach(({ timestamp, nickname: name, message }) => {
    const messageInfo = `${timestamp} - ${name}: ${message}`;
    messagesList.appendChild(createNewMessage(messageInfo));
  });
});

window.onbeforeunload = () => {
  socket.disconnect();
};