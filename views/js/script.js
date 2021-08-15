const inputChat = document.querySelector('#message');
const nicknameInput = document.querySelector('#name');
const nickBtn = document.querySelector('#send-nick');
const sendBtn = document.querySelector('#send-btn');
const socket = window.io('http://localhost:3000');
const usersBox = document.querySelector('#users');
const chatBox = document.querySelector('#chatbox');

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

function randomStringGenerator(size) {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < size; i += 1) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return String(randomString);
}

const user = randomStringGenerator(16);
let userb = user;
sendBtn.addEventListener('click', (e) => {
  const data = {
    chatMessage: inputChat.value,
    nickname: userb,
  };

  socket.emit('message', data);
  e.preventDefault();
  inputChat.value = '';
});

window.onload = () => {
  const li = document.createElement('li');
  const liContent = document.createTextNode(`${user}`);
  li.setAttribute('data-testid', 'online-user');
  li.appendChild(liContent);
  li.classList.add(`${user}`);
  usersBox.appendChild(li);

  socket.emit('save', user);
};

socket.on('message', (data) => {
  console.log(chatBox);
  const span = document.createElement('span');
  const spanContent = document.createTextNode(`${data}`);
  span.setAttribute('data-testid', 'message');
  span.appendChild(spanContent);
  chatBox.appendChild(span);
});

socket.on('onlineUsers', (data) => {
  console.log(data);
});

nickBtn.addEventListener('click', () => {
  userb = nicknameInput.value;
  const userTag = document.querySelector(`.${user}`);
  userTag.innerHTML = nicknameInput.value;
  nicknameInput.value = '';
});
