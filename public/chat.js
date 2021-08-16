const socket = window.io();

const form = document.querySelector('form');
const input = document.querySelector('input');
const ul = document.querySelector('ul');

// ref: https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/
const randomString = (tamanho) => {
  let string = '';
  const caracters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let index = 0; index < tamanho; index += 1) {
    string += caracters.charAt(Math.floor(Math.random() * caracters.length));
  }
  return string;
};

const createLi = (message) => {
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
};

form.addEventListener('submit', (event) => {
  const nickname = randomString(16);
  event.preventDefault();
  socket.emit('message', {
    chatMessage: input.value,
    nickname,
  });
  input.value = '';
});

socket.on('message', (message) => {
  createLi(message);
});