const socket = window.io();

let userNick = '';

const messageBtn = document.querySelector('#messageBtn');
const messageInput = document.querySelector('#messageInput');
const msgContainer = document.querySelector('#msgContainer');
const nickBtn = document.querySelector('#nickBtn');
const nickInput = document.querySelector('#nickInput');
const usersContainer = document.querySelector('#usersContainer');
const DATA_TEST_ID = 'data-testid';

const checkUserExists = () => document.querySelector('#myUser');
const createUserLi = (userNickname) => {
  const liUser = document.createElement('li');
  liUser.setAttribute(DATA_TEST_ID, 'online-user');
  liUser.innerText = userNickname;
  usersContainer.appendChild(liUser);
};

const createNick = ({ nick }) => {
    const userId = checkUserExists();
    if (!userId) {
      userNick = nick;
      const user = document.querySelector('#user');
      const nickname = document.createElement('span');
      nickname.setAttribute('id', 'myUser');
      nickname.innerText = nick;
      user.appendChild(nickname);
    }
    return null;
  };

const listUsers = ({ users }) => {
    usersContainer.innerHTML = '';
    createUserLi(userNick);
    users.forEach((u) => {
      if (u.nickname !== userNick) {
        createUserLi(u.nickname);
      }
    });
    return null;
  };

const updateNick = ({ nick }) => {
    userNick = nick;
    const userId = checkUserExists();
    userId.innerHTML = nick;
    nickInput.value = '';
    return null;
  };

nickBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const newNick = nickInput.value;
  socket.emit('updateNick', { newNick });
  updateNick({ nick: newNick });
});

messageBtn.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: messageInput.value, nickname: userNick });
  messageInput.value = '';
});

socket.on('connected', ({ nick, users }) => [createNick({ nick }), listUsers({ users })]);

socket.on('refreshUsers', listUsers);

socket.on('message', (message) => {
  const newMessage = document.createElement('li');
  newMessage.setAttribute(DATA_TEST_ID, 'message');
  newMessage.innerText = message;
  msgContainer.appendChild(newMessage);
});

socket.on('disconnectUser', ({ users }) => {
  listUsers({ users });
});