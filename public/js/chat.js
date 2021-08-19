const socket = window.io();

const chatBtn = document.querySelector('#sendMsg');
const inputMessage = document.querySelector('#messageInput');
const newName = document.querySelector('#newName');
const changeName = document.querySelector('#changeName');

let newNick = '';

socket.emit('msgHistory');

const createRandomName = (length) => {
  let result = '';
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    result += validChars.charAt(Math.floor(Math.random() * validChars.length));
  }

  return result;
};

const connectedUsers = () => {
  const usersList = document.querySelector('#usersList');

  if (!newNick) newNick = createRandomName(16);

  const li = document.createElement('li');
  li.innerText = newNick;
  li.setAttribute('data-testid', 'online-user');
  usersList.appendChild(li);
};

socket.on('wellcome', () => connectedUsers());

changeName.addEventListener('click', (event) => {
  event.preventDefault();

  newNick = newName.value;

  socket.emit('changeName', {
    nickname: newNick,
    chatMessage: inputMessage.value,
  });

  newName.value = '';
  return false;
});

chatBtn.addEventListener('click', (event) => {
  event.preventDefault();

  if (!newNick) newNick = createRandomName(16);

  socket.emit('message', {
    nickname: newNick,
    chatMessage: inputMessage.value,
  });
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messageUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  messageUl.appendChild(li);
};

socket.on('message', (mensagem) => createMessage(mensagem));

socket.on('getMesgs', (mesgs) => {
  mesgs.forEach(({ message, nickname, timestamp }) => {
    const msg = `${timestamp} ${nickname}: ${message}`;
    createMessage(msg);
  });
});
