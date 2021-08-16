const socket = window.io();

let nickname = null;

const inputMessage = document.getElementById('message');
const buttonSend = document.getElementById('send');
const inputUser = document.getElementById('user');
const buttonSave = document.getElementById('save');
const ulMessages = document.getElementById('messages');
const ulUsers = document.getElementById('users');

buttonSend.addEventListener('click', () => {
    socket.emit('message', { chatMessage: inputMessage.value, nickname });
});

buttonSave.addEventListener('click', () => {
    nickname = inputUser.value;
    socket.emit('updatenick', inputUser.value);
});

const createMessage = (message) => {
    const liMessage = document.createElement('li');
    liMessage.innerText = message;
    liMessage.dataset.testid = 'message';
    return liMessage;
};

const createUser = (user) => {
    const liUser = document.createElement('li');
    liUser.innerText = user;
    liUser.dataset.testid = 'online-user';
    return liUser;
};

socket.on('message', (message) => {
    ulMessages.appendChild(createMessage(message));
});

socket.on('messagehistory', (messages) => {
    messages.forEach((message) => {
        ulMessages.appendChild(createMessage(message));
    });
});
socket.on('updatenick', ({ oldNickname, newNickname }) => {
    const users = Array.from(ulUsers.children);
    const liOldNickname = users.find((user) => user.innerText === oldNickname);
    liOldNickname.innerText = newNickname;
});

socket.on('nickname', (nick) => {
    nickname = nick;
});

socket.on('userlist', (users) => {
    ulUsers.innerHTML = '';
    ulUsers.appendChild(createUser(nickname));
    users
    .forEach((user) => {
        if (user !== nickname) ulUsers.appendChild(createUser(user));
    });
});