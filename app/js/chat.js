const socket = window.io();
const form = document.querySelector('#chat');
const input = document.querySelector('#message');
const messages = document.querySelector('#messages');
const nicknameField = document.querySelector('#nickname');
const formNickname = document.querySelector('#set-nickname');
const nickInput = document.querySelector('#input-nick');

const generateNickname = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

let nickname = generateNickname(16);

const setNickname = () => {
  localStorage.setItem('nickname', nickname);
  nicknameField.textContent = nickname;
};

setNickname();

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input.value) {
    socket.emit('message', { chatMessage: input.value, nickname });
    input.value = '';
  }
});

formNickname.addEventListener('submit', (e) => {
  e.preventDefault();

  if (nickInput.value) {
    nickname = nickInput.value;
    nickInput.value = '';
    setNickname();
  }
});

socket.on('message', (msg) => {
  const item = document.createElement('li');
  item.setAttribute('data-testid', 'message');
  item.textContent = msg;
  messages.appendChild(item);
});