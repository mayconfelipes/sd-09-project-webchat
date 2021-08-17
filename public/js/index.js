const socket = window.io('http://localhost:3000');

const userInput = document.querySelector('.nickname');
const saveUserButton = document.querySelector('.post-nickname');
const messageInput = document.querySelector('.text-message');
const sendMessageButton = document.querySelector('.post-message');

const addNewUser = (userList) => {
  const userListElement = document.querySelector('.user-list');

  userListElement.innerHTML = null;
  userList.forEach((user) => {
    const newUserElement = document.createElement('li');
    newUserElement.innerText = user.nickname;
    newUserElement.dataset.testid = 'online-user';
    newUserElement.dataset.key = user.userId;

    userListElement.appendChild(newUserElement);
  });
};

saveUserButton.addEventListener('click', (e) => {
  e.preventDefault();

  const newNickname = userInput.value;

  socket.emit('changeNickname', newNickname);

  userInput.value = '';
  return false;
});

let updateNickname;

socket.on('connection', (userList) => {
  addNewUser(userList);
  if (!updateNickname) updateNickname = userList[userList.length - 1].nickname;
});

socket.on('nickname', (nickname) => {
  updateNickname = nickname;
});

socket.on('replaceUsername', (userList) => {
  addNewUser(userList);
});

const currentDate = () => {
  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return { day, month, year, hour, minutes, seconds };
};

sendMessageButton.addEventListener('click', (e) => {
  e.preventDefault();

  const chatMessage = messageInput.value;

  const { day, month, year, hour, minutes, seconds } = currentDate();

  const messageObj = {
    chatMessage,
    currentTime: `${day}-${month}-${year} ${hour}:${minutes}:${seconds}`,
    nickname: updateNickname,
  };

  socket.emit('message', messageObj);

  messageInput.value = '';
  return false;
});

const addNewMessage = (message) => {
  const messageList = document.querySelector('.message-list');

  const newMessageElement = document.createElement('li');
  newMessageElement.innerText = message;
  newMessageElement.dataset.testid = 'message';
  messageList.appendChild(newMessageElement);
};

const refreshMessageList = (updatedMessageList) => {
  const messageList = document.querySelector('.message-list');

  messageList.innerHTML = null;
  updatedMessageList.forEach(({ message, timestamp, nickname }) => {
    const newMessageElement = document.createElement('li');

    newMessageElement.innerText = `${timestamp} - ${nickname}: ${message}`;
    newMessageElement.dataset.testid = 'message';

    messageList.appendChild(newMessageElement);
  });
};

socket.on('message', addNewMessage);
socket.on('updateMessageList', refreshMessageList);
