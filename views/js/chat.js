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
  li.setAttribute('data-testid', 'message');
  messagesUl.appendChild(li);
};

const createAndAppendOnlineUser = (innerText) => {
  const ul = document.querySelector('#online-user');
  const li = document.createElement('li');
  li.className = 'list-group-item list-group-item';
  li.setAttribute('data-testid', 'online-user');
  li.innerText = innerText;
  ul.appendChild(li);
};

socket.on('message', (formatedMsg) => createMessages(formatedMsg));

socket.on('usersConnected', (onlineUsers) => {
  onlineUsers
    .forEach(({ randoNickname }) => createAndAppendOnlineUser(randoNickname));
});

socket.on('historyMessages', (historyMessages) => {
  historyMessages
    .forEach(({ message: msg, nickname, timestamp }) => {
      createMessages(`${timestamp} - ${nickname}: ${msg}`);
    });
});
