const createRandomName = () => {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 16; i += 1) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};

const createMessage = (message) => {
  const list = document.querySelector('#messageList');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  list.appendChild(li);
};

const socket = window.io();
let nickname = createRandomName();
const sendMessage = document.querySelector('#sendMessage');
const changeNickname = document.querySelector('#buttonNickname');
const usersList = document.querySelector('#onlineList');
usersList.innerHTML = '';

const createOnline = (user) => {
  const list = document.querySelector('#onlineList');
  const li = document.createElement('li');
  li.innerText = user;
  li.setAttribute('data-testid', 'online-user');
  li.className = 'users';
  list.appendChild(li);
};

const setOnline = () => {
  socket.emit('setOnline', nickname);
};

setOnline();

socket.on('messageList', (messageList) => {
  messageList.forEach(({ message }) => createMessage(message));
});

sendMessage.addEventListener('click', () => {
  const chatMessage = document.querySelector('#inputMessage').value;
  socket.emit('message', { chatMessage, nickname });
});

changeNickname.addEventListener('click', () => {
  const newNickname = document.querySelector('#inputNickname').value;
  socket.emit('changeNickname', { newNickname, nickname });
  nickname = newNickname;
  const users = document.querySelector('.users');
  users[0].innerText = newNickname;
});

socket.on('message', (message) => createMessage(message));

const setUsersOnline = (usersOnline) => {
  usersList.innerHTML = '';
  createOnline(nickname);
  usersOnline.forEach(({ user }) => {
    if (user !== nickname) {
      createOnline(user);
    }
  });
};

window.onbeforeunload = (e) => {
  e.preventDefault();
  socket.disconnect();
};

socket.on('usersOnline', (usersOnline) => setUsersOnline(usersOnline));
