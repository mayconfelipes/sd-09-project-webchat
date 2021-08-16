const socket = window.io('http://localhost:3000');

const userInput = document.querySelector('.nickname');
const saveUserButton = document.querySelector('.post-nickname');
const messageInput = document.querySelector('.text-message');
const sendMessageButton = document.querySelector('.post-message');

const addNewUser = ({ userName, userId }) => {
  const userList = document.querySelector('.user-list');

  const newUserElement = document.createElement('li');
  newUserElement.innerText = userName;
  newUserElement.dataset.testid = 'online-user';
  newUserElement.dataset.key = userId;

  userList.appendChild(newUserElement);
};

saveUserButton.addEventListener('click', (e) => {
  e.preventDefault();

  const newUser = userInput.value;

  socket.emit('newUser', newUser);

  userInput.value = '';
  return false;
});

let currentUser;

const replaceUsername = ({ userName, userId }) => {
  const user = document.querySelector(`[data-key=${userId}]`);
  user.innerText = userName;
  currentUser = userName;
};

socket.on('connection', ({ randomName: userName, userId }) => {
  addNewUser({ userName, userId });
  currentUser = userName;
});

socket.on('replaceUsername', replaceUsername);

sendMessageButton.addEventListener('click', (e) => {
  e.preventDefault();

  const chatMessage = messageInput.value;

  const messageObj = {
    chatMessage,
    nickname: currentUser,
  };

  socket.emit('message', messageObj);

  messageInput.value = '';
  return false;
});

const addNewMessage = (message) => {
  const messageList = document.querySelector('.message-list');

  const newMessageElement = document.createElement('li');
  newMessageElement.innerText = message;
  newMessageElement.dataset.testid = 'message';
  messageList.appendChild(newMessageElement);
};

socket.on('message', addNewMessage);
