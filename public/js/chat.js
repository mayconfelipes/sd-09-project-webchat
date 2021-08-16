const socket = window.io();

const form = document.querySelector('form');
const chatMessage = document.querySelector('#messageInput');
const inputName = document.querySelector('#inputNickname');
const saveNick = document.querySelector('#btnSave');
let nickname = '';

const createRandomNickname = () => {
  const element = document.querySelector('#userNickname');
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 1; i <= 16; i += 1) {
    nickname += characters.charAt(Math.floor(Math.random()
* charactersLength));
 }
 element.innerText = nickname;
 return nickname;
};

createRandomNickname();

saveNick.addEventListener('click', (e) => {
  e.preventDefault();
  nickname = inputName.value;
  inputName.value = '';
  return console.log(nickname);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: chatMessage.value, nickname });
  chatMessage.value = '';
  console.log(nickname.length);
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  messagesUl.appendChild(li);
};

socket.on('message', (message) => createMessage(message));
