// Fonte: https://qastack.com.br/programming/1349404/generate-random-string-characters-in-javascript
const createNickname = (qtdWorks) => {
  let nickName = '';
  while (nickName.length < qtdWorks) {
    nickName += Math.random().toString(36).substr(2, qtdWorks - nickName.length);
  }
  return nickName;
};

const createMessage = (message) => {
  const messagesUl = document.querySelector('#mensagens');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  messagesUl.appendChild(li);
};

  module.exports = {
    createNickname,
    createMessage,
  };