const socket = window.io();

const message = { chatMessage: '', nickname: '' };

document.querySelector('#save-user').addEventListener('click', () => {
  const nicknameInput = document.querySelector('#nickname');
  message.nickname = nicknameInput.value;
  socket.emit('nickname', nicknameInput.value);
  nicknameInput.value = '';
  return false;
});

document.querySelector('#send-msg').addEventListener('click', () => {
  const messageInput = document.querySelector('#messageInput');
  message.chatMessage = messageInput.value;
  socket.emit('chatMessage', messageInput.value);
  socket.emit('message', message);
  return false;
});

const createMessages = (msg) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = msg;
  li.className = 'list-group-item list-group-item-info';
  li.setAttribute('data-testid', 'message');
  messagesUl.appendChild(li);
};

const createOnlineUser = (userId) => {
  const ul = document.querySelector('#online-ul');
  const li = document.createElement('li');
  li.className = 'list-group-item list-group-item';
  li.setAttribute('data-testid', 'online-user');
  li.innerText = userId;

  if (socket.id.slice(0, 16) === userId) {
    ul.prepend(li);
  } else {
    ul.appendChild(li);
  }
};

socket.on('message', (formatedMsg) => createMessages(formatedMsg));

socket.on('usersConnectedId', (onlineClientsId) => {
  const ul = document.querySelector('#online-ul');
  ul.innerHTML = '';
  onlineClientsId.forEach((userId) => createOnlineUser(userId));
});

socket.on('historyMessages', (historyMessages) => {
  const messagesUl = document.querySelector('#messages');
  messagesUl.innerHTML = '';
  historyMessages
    .forEach(({ message: msg, nickname, timestamp }) => {
      createMessages(`${timestamp} - ${nickname}: ${msg}`);
    });
});
