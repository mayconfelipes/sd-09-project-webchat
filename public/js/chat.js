const socket = window.io();

const you = document.querySelector('#you');

socket.emit('newUser', you.innerText);

const appendUsers = (users) => {
  const userList = document.querySelector('#users');
  const totalUsers = document.querySelector('#total-users');
  totalUsers.innerText = `Users (${users.length})`;
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = `${user.nickname}`;
    userList.appendChild(li);
  });
};

const appendOlderMessages = (messages) => {
  const messagesArea = document.querySelector('#messages');
  messages.forEach(({ date, time, nickname, chatMessage }) => {
    const newUserMessage = document.createElement('li');
    newUserMessage.classList.add('message');
    newUserMessage.innerHTML = `<time>${date} ${time}</time> ${nickname}: ${chatMessage}`;
    messagesArea.appendChild(newUserMessage);
  });
};

const appendNewMessage = (message) => {
  const messagesArea = document.querySelector('#messages');
  const newUserMessage = document.createElement('li');
  newUserMessage.classList.add('message');
  newUserMessage.innerHTML = message;
  messagesArea.appendChild(newUserMessage);
};

const enteredChatMessage = (newUser) => {
  const messages = document.querySelector('#messages');
  const newUserMessage = document.createElement('li');
  newUserMessage.classList.add('new-user');
  newUserMessage.innerText = `${newUser} has entered the chat`;
  return messages.appendChild(newUserMessage);
};

const button = document.querySelector('#send-button');
const inputMessage = document.querySelector('#chat-input');

button.addEventListener('click', () => {
  socket.emit('message', { nickname: you.innerText, chatMessage: inputMessage.value });
  inputMessage.value = '';
});

socket.on('connected', ({ newUser, users }) => {
  appendUsers(users);
  enteredChatMessage(newUser);
});

socket.on('oldMessages', (messages) => {
  appendOlderMessages(messages);
});

socket.on('message', (message) => {
  appendNewMessage(message);
});
