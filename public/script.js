// const socket = io();
const socket = io('http://localhost:3000');

const nicknameBtn = document.querySelector('#nickname-btn');
const sendBtn = document.querySelector('#send-btn');

const messagesUl = document.querySelector('#messages-list');
const usersUl = document.querySelector('#users-list');

let nickname = null;

const createMessage = () => {
  const messageInput = document.querySelector('#message-input').value;
  const li = document.createElement('li');

  li.innerText = messageInput;
  li.setAttribute('data-testid', 'message');
  messagesUl.appendChild(li);

  return false;
};

sendBtn.addEventListener('click', () => {
  const messageInput = document.querySelector('#message-input').value;
  socket.emit('message', {
    nickname,
    chatMessage: messageInput,
  });

  return false;
});

nicknameBtn.addEventListener('click', () => {
  const nicknameInput = document.querySelector('#nickname-input').value;
  console.log('nickname ===##===', nicknameInput);
  socket.emit('nickname', nicknameInput);

  return false;
});

//Retornos

socket.on('message', (message) => {
  const messageLI = document.createElement('li');
  messageLI.innerHTML = message;
  messagesUl.appendChild(messageLI);
});

socket.on('updateList', (users) => {
  if (usersUl) usersUl.innerHTML = '';
  users.forEach((user) => {
    const userLi = document.createElement('li');
    userLi.innerHTML = user;
    userLi.setAttribute('data-testid', 'online-user');
    usersUl.appendChild(userLi);
  });
});


