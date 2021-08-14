const socket = window.io();

const message = { chatMessage: '', nickname: '' };

const createUsersList = (nickname) => {
  const usersUl = document.querySelector('#users');
  const li = document.createElement('li');
  li.innerText = nickname;
  li.className = 'list-group-item success mb-2';
  usersUl.appendChild(li);
};

document.querySelector('#save-user').addEventListener('click', () => {
  const nicknameInput = document.querySelector('#nickname');
  message.nickname = nicknameInput.value;
  socket.emit('nickname', nicknameInput.value);

  createUsersList(nicknameInput.value);
  nicknameInput.value = '';
  return false;
});

document.querySelector('#send-msg').addEventListener('click', () => {
  const messageInput = document.querySelector('#messageInput');
  message.chatMessage = messageInput.value;
  socket.emit('chatMessage', messageInput.value);
  socket.emit('message', message);
  messageInput.value = '';
  return false;
});

const createMessages = (msg) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = msg;
  li.className = 'list-group-item list-group-item-info';
  messagesUl.appendChild(li);
};

socket.on('message', (formatedMsg) => createMessages(formatedMsg));
