const socket = window.io();

let nickname = '';

socket.emit('initialList');

const inputMessage = document.getElementById('message');
const buttonSend = document.getElementById('send');
const inputNickname = document.getElementById('nickname');
const buttonSave = document.getElementById('save');
const messagesUl = document.getElementById('messages');
const usersUl = document.getElementById('users');

buttonSend.addEventListener('click', () => {
    socket.emit('message', { chatMessage: inputMessage.value, nickname });
});

buttonSave.addEventListener('click', () => {
    nickname = inputNickname.value;
    socket.emit('savenickname', inputNickname.value);
    inputNickname.value = '';
});

const createMessage = (message) => {
    const li = document.createElement('li');
    li.innerText = message;
    li.dataset.testid = 'message';
    messagesUl.appendChild(li);
};

const createUser = (user) => {
    const li = document.createElement('li');
    li.innerText = user;
    li.dataset.testid = 'online-user';
    return li;
};

socket.on('message', (message) => createMessage(message));

socket.on('userlist', ({ users, newNickname }) => {
  usersUl.innerHTML = '';
  nickname = newNickname;
  const firstNick = Object.keys(users).find((user) => user === socket.id.toString());
  const otherNicks = Object.values(users).filter((user) => user !== users[firstNick]);

  const userList = [users[firstNick], ...otherNicks];
  userList.forEach((user) => {
    usersUl.appendChild(createUser(user));
  });
});