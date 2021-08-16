const socket = window.io();

const addNewUserBtn = document.querySelector('.newUserBtn');
const sendBtn = document.querySelector('.sendBtn');

const randomNick = Math.random().toString(15).substr(-20);

socket.emit('randomNick', randomNick);

const createNewUser = (userName) => {
  const newUser = document.createElement('li');
  newUser.className = 'user';
  newUser.innerHTML = userName;
  return newUser;
};

const createNewMessage = (message) => {
  const messageElement = document.createElement('li');
  messageElement.innerHTML = message;
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
});

socket.on('updateUsers', (usersList) => {
  const usersUl = document.querySelector('.usersList');
  usersUl.innerHTML = '';
  Object.values(usersList).forEach((user) => {
    usersUl.appendChild(createNewUser(user));
  });
});

// enviar menssagem
sendBtn.addEventListener('click', () => {
  const inputMessage = document.querySelector('.messageInput');
  const chatMessage = inputMessage.value;
  const nickname = socket.id;
  socket.emit('message', { chatMessage, nickname });
  inputMessage.value = '';
});

// receber messagem
socket.on('message', (message) => {
  const messagesList = document.querySelector('.webChat');
  messagesList.appendChild(createNewMessage(message));
});

window.onbeforeunload = () => {
  socket.disconnect();
};