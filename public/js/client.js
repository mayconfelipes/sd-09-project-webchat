const socket = window.io();

const form = document.querySelector('form');
const inputMessage = document.querySelector('#messageInput');
const buttonUser = document.querySelector('#button-user');
const inputUser = document.querySelector('#input-user');
const users = document.querySelector('#users');
let user = '';

buttonUser.addEventListener('click', () => {
  user = inputUser.value;
  socket.emit('user', user);
  // no click do botão ele já envia o apelido
});

form.addEventListener('submit', (e) => {
  e.preventDefault(); // para não ficar atualizando o formulário
  socket.emit('message', {
    chatMessage: inputMessage.value,
    nickname: user,
  });
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messageUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message'); // gerar os atributos no campo
  messageUl.appendChild(li);
};

socket.on('nicknameSlice', (nickname) => {
  user = nickname;
  const li = document.createElement('li');
  li.innerText = user;
  li.setAttribute('data-testid', 'online-user');
  users.appendChild(li);
});

socket.on('messages', (messages) => messages.forEach((message) => createMessage(message)));
socket.on('message', (message) => createMessage(message));