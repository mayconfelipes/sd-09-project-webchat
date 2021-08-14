const socket = window.io(); // Chama o <script src="/socket.io/socket.io.js"></script>
const DATA_TESTID = 'data-testid';

socket.on('connect', () => { // Gera o nickname randomico e envia para o back-end
  const user = `User-${Math.random().toString().slice(2, 13)}`;
  localStorage.setItem('nickname', JSON.stringify(user));
  const nick = document.querySelector('#user-nickname');
  nick.textContent = user;
  socket.emit('create user', user);
});

socket.on('append user', ({ id, nickname }) => { // Renderiza o usuario no front-end
  const userWindow = document.querySelector('#users-list');
  const onlineUser = document.createElement('li');
  onlineUser.setAttribute(DATA_TESTID, 'online-user');
  onlineUser.textContent = nickname;
  onlineUser.id = id;
  userWindow.appendChild(onlineUser);
});

socket.on('get user list', (userList) => { // Renderiza a lista de usuarios no front-end
  const userWindow = document.querySelector('#users-list');
  userList.forEach((user) => {
      const userOnList = document.createElement('li');
      userOnList.setAttribute(DATA_TESTID, 'online-user');
      userOnList.id = user.id;
      userOnList.textContent = user.nickname;
      userWindow.appendChild(userOnList);
  });
});

socket.on('message', (message) => { // Recebe a mensagem formatada do back-end e renderiza no front-end
  const chatWindow = document.querySelector('#messages-list');
  const msg = document.createElement('li');
  msg.setAttribute(DATA_TESTID, 'message');
  msg.textContent = message;
  chatWindow.appendChild(msg);
});

socket.on('update nickname', ({ id, nickname }) => { // Recebe o nickname atualizado e faz alteracoes no front-end
  const userOnList = document.querySelector(`#${id}`);
  const userNickname = document.querySelector('#user-nickname');
  userOnList.textContent = nickname;
  userNickname.textContent = nickname;
});

socket.on('remove user', (userToBeRemoved) => { // Remove o usuario que se desconectou da lista no front-end
  const userLi = document.querySelector(`#${userToBeRemoved.id}`);
  userLi.remove();
});

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
    socket.emit('update nickname', input.value); // o nickname no input e enviada ao back-end para atualizar o usuario
    localStorage.setItem('nickname', JSON.stringify(input.value));
    input.value = '';
  }

  return false;
});