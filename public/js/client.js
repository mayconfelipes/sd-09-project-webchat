const socket = window.io();

const addNewUserBtn = document.querySelector('.newUserBtn');
const sendBtn = document.querySelector('.sendBtn');

let nickname = '';

socket.emit('randomNick');

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

socket.on('updateUsers', ({ usersList, name }) => {
  nickname = name;
  console.log(name);
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