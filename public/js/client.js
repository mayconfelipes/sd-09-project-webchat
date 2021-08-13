const client = window.io();
const listaMensagens = document.querySelector('#messages');
const listUsers = document.querySelector('#listUsers');
const idMessages = document.querySelector('#messages');
const nick = document.querySelector('#nickname');
const insertNick = document.querySelector('#insertNick');
const insertMess = document.querySelector('#insertMessage');
const mess = document.querySelector('#message');

const createMessage = (message) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  listaMensagens.appendChild(li);
  return `${message}`;
};

// https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/
const randomNickname = (size) => {
  let nickname = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < size; i += 1) {
    nickname += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return nickname;
};

let nickname = randomNickname(16);

client.emit('nickname', { nickname });

const getMessages = async () => {
  fetch('http://localhost:3000/messages')
  .then((response) => response.json())
  .then((messages) => {
    messages.forEach((message) => {
      const stringMessage = `${message.timestamp} ${message.nickname} ${message.message}`;
     const msgCreated = createMessage(stringMessage);
     idMessages.append(msgCreated);
    });   
  });
};

window.onload = function start() {
  getMessages();
};

insertNick.addEventListener('submit', (e) => {
  e.preventDefault();
  const nickValue = nick.value;
    nickname = nickValue;
    client.emit('nickname', { nickname: nickValue });
    const userElement = document.querySelector('[data-testid="online-user"]');
    userElement.innerText = nickValue;
});

const updateNicknames = ({ nicknames }) => {
  const users = [nickname, ...nicknames.filter((n) => n !== nickname)];
  listUsers.innerHTML = '';
  users.forEach((user) => {
    const onlineUser = document.createElement('li');
    onlineUser.setAttribute('data-testid', 'online-user');
    onlineUser.innerText = user;
    listUsers.appendChild(onlineUser);
  });
};

client.on('updateNicknames', updateNicknames);

insertMess.addEventListener('submit', (e) => {
  const userElement = document.querySelector('[data-testid="online-user"]');
  e.preventDefault();
  const message = { chatMessage: mess.value, nickname: userElement.innerText };
  client.emit('message', message);
});

client.on('message', createMessage);

client.on('disconnect', () => {
  console.log(`${nickname} disconnected`);
});

// Referências: https://github.com/tryber/sd-07-project-webchat/pull/3/files;