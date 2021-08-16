const socket = window.io();

socket.emit('FetchChatHistory');

let actuallyNick = '';

const saveButton = document.querySelector('#form-nickname-button');
saveButton.addEventListener('click', () => {
  const newNickName = document.querySelector('#nickname-input');
  socket.emit('changeNick', newNickName.value);
  newNickName.value = '';
  return false; 
});

socket.on('onlineUsers', ({ users, arrayUsers }) => {
  const usersOnline = document.querySelector('#users-online');
  usersOnline.innerHTML = '';
  actuallyNick = users[socket.id];
  const othersOnlineUsers = arrayUsers.filter((user) => user !== actuallyNick);
  const userList = [actuallyNick, ...othersOnlineUsers];
  userList.forEach((user) => {
    const li = document.createElement('li');
    li.innerHTML = user;
    li.setAttribute('data-testid', 'online-user');
    usersOnline.appendChild(li);
  });
});

const sendButton = document.querySelector('#form-message-button');
sendButton.addEventListener('click', () => {
  const chatMessage = document.querySelector('#message');
  socket.emit('message', { chatMessage: chatMessage.value, nickname: actuallyNick });

  chatMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const menssagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerHTML = message;
  li.setAttribute('data-testid', 'message');

  menssagesUl.appendChild(li);
};

socket.on('message', (message) => {
  createMessage(message);
});

socket.on('FetchChatHistory', (messages) => {
  messages.forEach(({ message, nickname, timestamp }) => {
    const formatedMessage = `${timestamp} - ${nickname}: ${message}`;
    createMessage(formatedMessage);
  });
});

window.onbeforeunload = () => {
  socket.disconnect();
};