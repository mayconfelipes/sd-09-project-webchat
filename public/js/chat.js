const socket = window.io();

const form = document.querySelector('form');
const chatMessage = document.querySelector('#messageInput');
const saveNick = document.querySelector('#btnSave');
const ulUser = document.querySelector('#ulUser');
const messagesUl = document.querySelector('#messages');
const data = 'data-testid';

let user;

socket.on('userConnected', (randomNickname) => {
  user = randomNickname;
  socket.emit('userNickname', user);
});

saveNick.addEventListener('click', (e) => {
  e.preventDefault();
  const inputName = document.querySelector('#inputNickname');
  user = inputName.value;
  socket.emit('updateNickname', user);
  inputName.value = '';
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: chatMessage.value, nickname: user });
  chatMessage.value = '';
});

const createMessage = (message) => {
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute(data, 'message');
  messagesUl.appendChild(li);
};

socket.on('message', (message) => createMessage(message));

socket.on('messages', (messages) => {
  messages.forEach((msg) => createMessage(msg));
});

socket.on('users', (usersList) => {
  ulUser.innerHTML = '';
  const userLi = document.createElement('li');
  userLi.innerText = user;
  userLi.setAttribute('data-testid', 'online-user');
  ulUser.appendChild(userLi);
  usersList.forEach((element) => {
    if (element !== user) {
      const li = document.createElement('li');
      li.innerText = element;
      li.setAttribute(data, 'online-user');
      ulUser.appendChild(li);
    }
  });
});
