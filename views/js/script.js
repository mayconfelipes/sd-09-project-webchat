const inputChat = document.querySelector('#message');
// const username = document.querySelector('#name');
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
sendBtn.addEventListener('click', (e) => {
  const data = {
    chatMessage: inputChat.value,
    nickname: user,
  };
  socket.emit('message', data);
  e.preventDefault();
});

window.onload = () => {
  const li = document.createElement('li');
  const liContent = document.createTextNode(`${user}`);
  li.appendChild(liContent);
  usersBox.appendChild(li);
};

socket.on('message', (data) => {
  console.log(chatBox);
  const span = document.createElement('span');
  const spanContent = document.createTextNode(`${data}`);
  span.appendChild(spanContent);
  chatBox.appendChild(span);
});
