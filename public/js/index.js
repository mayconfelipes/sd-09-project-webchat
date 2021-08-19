const socket = io();

console.log('ENTROUUUUUU')

const form = document.querySelector('.form');
const inputMessage = document.querySelector('.form input')
form.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('mensagem', inputMessage.value);
  inputMessage.value = '';
  return false;
})

const createListMessage = (message) => {
  console.log(message);
  const ulContainer = document.querySelector('.messages ul')
  const liMessage = document.createElement('li');
  liMessage.innerText = message;
  ulContainer.appendChild(liMessage);
}

const showAlert = (msg) => {
  alert(msg);
}

socket.on('welcome', (welcome) => createListMessage(welcome));
socket.on('chatMessage', (value) => createListMessage(value));