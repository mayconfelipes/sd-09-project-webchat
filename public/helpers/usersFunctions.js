const ATTRIBUTEDATATESTID = 'data-testid';

// Fonte: https://qastack.com.br/programming/1349404/generate-random-string-characters-in-javascript
const createNickname = (qtdWorks) => {
  let nickName = '';
  while (nickName.length < qtdWorks) {
    nickName += Math.random().toString(36).substr(2, qtdWorks - nickName.length);
  }
  return nickName;
};

const createMessage = (message) => {
  const messageUl = document.querySelector('.messages');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute(ATTRIBUTEDATATESTID, 'message');
  li.className = 'listMessages';
  messageUl.appendChild(li);
};

const getDataHora = () => {
  const data = new Date().toLocaleDateString('pt-br').split('/').join('-');
  const hora = new Date().toLocaleTimeString('pt-br');
  return `${data} ${hora}`;
};

const createUser = (ListUsers, ninckname) => {
  const userUl = document.querySelector('.users');
  userUl.innerText = ''; // para não duplicar as informações em tela
  const liUserLogado = document.createElement('li');
  liUserLogado.innerText = ninckname;
  liUserLogado.setAttribute(ATTRIBUTEDATATESTID, 'online-user');
  userUl.appendChild(liUserLogado); // Para exibir o nome do usuario logado em 1º na lista 
  
  ListUsers.forEach((user) => {
    if (user !== ninckname) {
      const liUsers = document.createElement('li'); // Para os usuarios restantes
      liUsers.setAttribute(ATTRIBUTEDATATESTID, 'online-user');
      liUsers.innerText = user;
      userUl.appendChild(liUsers);
   }
  });
};

  module.exports = {
    createNickname,
    createMessage,
    getDataHora,
    createUser,
  };