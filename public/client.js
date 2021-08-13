const client = window.io();
console.log('js');

const formNickName = document.getElementById('nickname');
const formSendMessage = document.getElementById('sendmessage');

// https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/
function generateString(size) {
  let stringRandom = '';
  const caracteres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  for (let count = 1; count <= size; count += 1) {
    const numberRandom = (Math.random() * caracteres.length);
    const numberCaracter = Math.floor(numberRandom);
    stringRandom += caracteres[numberCaracter];
  }
  // console.log(stringRandom);
  return stringRandom;
}
// https://qastack.com.br/programming/3842614/how-do-i-call-a-javascript-function-on-page-load
// executa ao carregar a pg Alternativa ao (client.on)
// window.onload = () => {
//   const nickNameRandom = generateString(16);
//   console.log(nickNameRandom);
//   localStorage.setItem('nickname', JSON.stringify(nickNameRandom));
//   client.emit('clientNickNameRandom', nickNameRandom);
// };

// https://imasters.com.br/desenvolvimento/conectando-no-socket-io-avancado
// Executa ao conectar
client.connect('http://localhost:3000/');
client.on('connect', () => {
  const nickNameRandom = generateString(16);
  localStorage.setItem('nickname', JSON.stringify(nickNameRandom));
  client.emit('clientNickNameRandom', nickNameRandom);
});

// FN reinderiza Mensagens
function renderMessage(message) {
  const chatList = document.getElementById('chat');
  const newMessageChat = document.createElement('li');
  newMessageChat.setAttribute('data-testid', 'message');
  newMessageChat.innerText = message;
  chatList.appendChild(newMessageChat);
}

// https://stackoverflow.com/questions/4777077/removing-elements-by-class-name
// FN reinderiza usuários online
function renderOnlineUsers(clients) {
  const usersList = document.getElementById('onlineUser');
  const liUsers = document.getElementsByClassName('liUsers');

  while (liUsers.length > 0) liUsers[0].remove();
  
  clients.forEach((el) => {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'online-user');
    li.className = ('liUsers');
    li.innerText = el.nickName;
    usersList.appendChild(li);
  });
}

// Evento add ao form de captura e envio nome de usuário
formNickName.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputNickName = document.getElementById('fieldnickname').value;
  localStorage.setItem('nickname', JSON.stringify(inputNickName));
  client.emit('nickNameUpdate', inputNickName);
});

// Evento add ao form de captura e envia mensagem 
formSendMessage.addEventListener('submit', (e) => {
  e.preventDefault();
  const chatMessage = document.getElementById('fieldsendmessage').value;
  const nickname = localStorage.getItem('nickname');
  client.emit('message', { chatMessage, nickname });
});

// Recebe mensagens e envia para reinderização
client.on('message', (data) => {
  renderMessage(data);
});

// recebe atualizações usuários
client.on('updateOnlineUsers', (clients) => {
  const currrentClient = clients.find((el) => el.clientId === client.id);
  const clientsForRender = clients.filter((el) => el.clientId !== client.id);
  clientsForRender.unshift(currrentClient);
  renderOnlineUsers(clientsForRender);
});

// Força desconexão
// client.on('disconnected', () => {
//   client.disconnect();
// });
