const socket = window.io();

const form = document.querySelector('form');
const chatMessage = document.querySelector('#messageInput');
const inputName = document.querySelector('#inputNickname');
const saveNick = document.querySelector('#btnSave');
const idBox = document.querySelector('#userNickname');
const messagesUl = document.querySelector('#messages');

let randomID = '';
let user = '';

const createRandomID = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 1; i <= 16; i += 1) {
    randomID += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 idBox.innerText = randomID;
 socket.emit('randomID', randomID);
};

createRandomID();

saveNick.addEventListener('click', (e) => {
  e.preventDefault();
  user = inputName.value;
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
  li.setAttribute('data-testid', 'message');
  messagesUl.appendChild(li);
};

socket.on('message', (message) => createMessage(message));

socket.on('messages', (messages) => {
  messages.forEach((msg) => createMessage(msg));
});
