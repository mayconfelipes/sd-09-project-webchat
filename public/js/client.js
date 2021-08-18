const socket = window.io();

const form = document.querySelector('form');
const inputMessage = document.querySelector('#messageInput');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // para não ficar atualizando o formulário
  socket.emit('message', {
    chatMessage: inputMessage.value,
    nickname: 'testando',
  });
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messageUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  messageUl.appendChild(li);
};

socket.on('message', (message) => createMessage(message));