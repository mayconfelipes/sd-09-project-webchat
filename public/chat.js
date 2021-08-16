const socket = window.io();

const formMessage = document.querySelector('.message-box');
const inputMessage = document.querySelector('#message-box');
const inputNickname = document.querySelector('#nickname-box');
const ulMessage = document.querySelector('#message');
const formUser = document.querySelector('.nickname-box');
const user = document.querySelector('#online-user');

// ref: https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/
const randomString = (tamanho) => {
  let string = '';
  const caracters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let index = 0; index < tamanho; index += 1) {
    string += caracters.charAt(Math.floor(Math.random() * caracters.length));
  }
  return string;
};
let nickname = randomString(16);

const createUser = () => {
  user.innerText = nickname;
};
createUser();

const createMessage = (message) => {
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  ulMessage.appendChild(li);
};

formMessage.addEventListener('submit', (event) => {
  event.preventDefault();
  socket.emit('message', {
    chatMessage: inputMessage.value,
    nickname,
  });
  inputMessage.value = '';
});

formUser.addEventListener('submit', (event) => {
  event.preventDefault();

  user.innerText = inputNickname.value;
  nickname = inputNickname.value;
});

socket.on('message', (message) => {
  createMessage(message);
});

socket.on('getMessages', (oldMessages) => {
  oldMessages.forEach(({ message, nickname: nick, timestamp }) => {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'message');
    li.textContent = `${timestamp} - ${nick}: ${message}`;
    ulMessage.appendChild(li);
  });
});