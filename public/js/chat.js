const socket = window.io();

const chatBtn = document.querySelector('#sendMsg');
const inputMessage = document.querySelector('#messageInput');

chatBtn.addEventListener('click', (event) => {
  event.preventDefault();
  socket.emit('message', {
    nickname: socket.id,
    chatMessage: inputMessage.value,
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

socket.on('message', (mensagem) => createMessage(mensagem));
