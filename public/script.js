const socket = window.io();

const nicknameBtn = document.querySelector('#nickname-btn');
const sendBtn = document.querySelector('#send-btn');

const messagesUl = document.querySelector('#messages-list');
const usersUl = document.querySelector('#users-list');

let nickname = '';

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
  nickname = nicknameInput;
  socket.emit('nickname', nicknameInput);

  return false;
});

// Retornos

const createMessage = (message) => {
  const messageLI = document.createElement('li');
  messageLI.innerHTML = message;
  messageLI.setAttribute('data-testid', 'message');
  messagesUl.appendChild(messageLI);
};

socket.on('message', (message) => createMessage(message));

socket.on('messageList', (messageList) => {
  messageList.forEach((message) => createMessage(message));
});

socket.on('newNickName', (newNickname) => nickname = newNickname);

socket.on('updateList', (users) => {
  usersUl.innerHTML = '';

  const index = users.indexOf(nickname);
  if (index !== -1) users.splice(index, 1);
  users.unshift(nickname);

  const usersArray = users.filter((user) => user !== '');

  usersArray.forEach((user) => {
    const userLi = document.createElement('li');
    userLi.innerHTML = user;
    userLi.setAttribute('data-testid', 'online-user');
    usersUl.appendChild(userLi);
  });
});
