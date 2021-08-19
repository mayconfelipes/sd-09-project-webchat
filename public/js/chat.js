const socket = window.io();
const DATA_TESTID = 'data-testid';
const you = document.getElementById('you');
const sendButton = document.getElementById('send-button');
const inputMessage = document.getElementById('chat-input');
const nicknameBox = document.getElementById('nickname-box');
const nicknameButton = document.getElementById('nickname-button');
const messagesArea = document.getElementById('messages');
const userList = document.getElementById('users');
let localNickname = localStorage.getItem('nickname');

sendButton.addEventListener('click', () => {
  socket.emit('message', { nickname: you.innerText, chatMessage: inputMessage.value });
  inputMessage.value = '';
});

nicknameButton.addEventListener('click', () => {
  socket.emit('newNickname', { newNickname: nicknameBox.value, oldNickname: you.innerText });
  localStorage.setItem('nickname', nicknameBox.value);
  you.innerText = nicknameBox.value;
});

if (localNickname) {
  you.innerText = localNickname;
  socket.emit('connected');
} else {
  localStorage.setItem('nickname', you.innerText);
  localNickname = you.innerText;
  // caso o usuário não esteja salvo, emitir um newUser
  socket.emit('newUser', localNickname);
}

// salva na localStorage

const appendUsers = (users) => {
  userList.innerHTML = '';
  const totalUsers = document.getElementById('total-users');
  totalUsers.innerText = `Users (${users.length})`;
  users.forEach((user) => {
    const li = document.createElement('li');
    li.setAttribute(DATA_TESTID, 'online-user');
    li.innerText = `${user.nickname}`;
    userList.appendChild(li);
  });
};

const appendOlderMessages = (messages) => {
  messages.forEach(({ date, time, nickname, chatMessage }) => {
    const olderMessage = document.createElement('li');
    olderMessage.classList.add('message');
    olderMessage.setAttribute(DATA_TESTID, 'message');
    olderMessage.innerHTML = `<time>${date} ${time}</time> ${nickname}: ${chatMessage}`;
    messagesArea.appendChild(olderMessage);
    olderMessage.scrollIntoView();
  });
};

const appendNewMessage = (message) => {
  const newUserMessage = document.createElement('li');
  newUserMessage.classList.add('message');
  newUserMessage.setAttribute(DATA_TESTID, 'message');
  newUserMessage.innerHTML = message;
  messagesArea.appendChild(newUserMessage);
  newUserMessage.scrollIntoView();
};

const appendNewNickname = ({ oldNickname, newNickname }) => {
  const list = [...userList.children];
  const index = list.findIndex((user) => user.innerText === oldNickname);
  userList.childNodes[index].innerText = newNickname;
};

const enteredChatMessage = (newUser) => {
  const newUserMessage = document.createElement('li');
  newUserMessage.classList.add('new-user');
  newUserMessage.innerText = `${newUser} has entered the chat`;
  return messagesArea.appendChild(newUserMessage);
};

socket.on('connected', ({ newUser, users }) => {
  appendUsers(users);
  if (newUser) enteredChatMessage(newUser);
});

socket.on('oldMessages', (messages) => {
  appendOlderMessages(messages);
});

socket.on('message', (message) => {
  appendNewMessage(message);
});

socket.on('newNickname', (nicknames) => appendNewNickname(nicknames));
