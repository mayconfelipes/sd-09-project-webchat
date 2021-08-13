const socket = window.io(); // Chama o <script src="/socket.io/socket.io.js"></script>

const user = `User-${Math.random().toString().slice(2, 13)}`;
const nick = document.querySelector('#user-nickname');
nick.textContent = user;
localStorage.setItem('nickname', JSON.stringify(user));

// evento que captura a mensagem que o usuario digitou
const messageForm = document.querySelector('#form');
messageForm.addEventListener('submit', (e) => {
  const messageInput = document.querySelector('#input');
  e.preventDefault();
  const payload = {
    nickname: JSON.parse(localStorage.getItem('nickname')),
    chatMessage: messageInput.value,
  };

  if (messageInput.value) {
    socket.emit('message', payload); // a mensagem no input e enviada ao back-end para formatacao
    messageInput.value = '';
  }

  return false;
});

// evento que captura o nickname que o usuario digitou
const updateNicknameButton = document.querySelector('#nickname-button');
updateNicknameButton.addEventListener('click', () => {
  const input = document.querySelector('#nickname-box');

  if (input.value) {
    socket.emit('nickname', input.value);
    localStorage.setItem('nickname', JSON.stringify(input.value));
    input.value = '';
  }

  return false;
});

const updateNickname = (nickname) => {
  nick.textContent = nickname;
};

const sendMessage = (message) => {
  const chatWindow = document.querySelector('#messages-list');
  const msg = document.createElement('li');
  msg.setAttribute('data-testid', 'message');
  msg.textContent = message;
  chatWindow.appendChild(msg);
  // window.scrollTo(0, document.body.scrollHeight);
};

// recebe a mensagem formatada do back-end e renderiza no front-end
socket.on('message', (message) => sendMessage(message));

socket.on('nickname', (nickname) => updateNickname(nickname));