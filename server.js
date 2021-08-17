// Faça seu código aqui
const express = require('express');
const path = require('path');
const { name } = require('faker');
const moment = require('moment');

moment.updateLocale('en', {
  longDateFormat: {
    L: 'DD-MM-YYYY',
  },
});

const app = express();

const socketIoServer = require('http').createServer(app);

const io = require('socket.io')(socketIoServer);
const messageModel = require('./models/messages');

let userList = [];
let messageList;

const generateRandomName = () => {
  let randomName;

  while (!/^[\w'-]{16}$/.test(randomName)) {
    randomName = `${name.firstName()}-${name.lastName()}`.toLowerCase();

    if (/^[\w'-]{16}$/.test(randomName)) break;
  }

  return randomName;
};

const changeNickname = (socket) => {
  socket.on('changeNickname', (newNickname) => {
    socket.emit('nickname', newNickname);

    userList = userList.map(({ userId, nickname }) => (
      userId === socket.id
        ? { nickname: newNickname, userId }
        : { userId, nickname }
    ));

    io.emit('replaceUsername', userList);
  });
};

const message = (socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    const currentTime = moment().format('L LTS');
    messageModel
      .postMessage({ message: chatMessage, nickname, timestamp: currentTime });

    io.emit('message', `${currentTime} - ${nickname}: ${chatMessage}`);
  });
};

const messages = async () => await messageModel.getAllMessages() || [];

messages().then((list) => {
  messageList = list;
});

io.on('connection', async (socket) => {
  const newRandomName = generateRandomName();
  const updatedMessageList = await messageModel.getAllMessages();

  io.emit('updateMessageList', updatedMessageList);

  userList.push({ nickname: newRandomName, userId: `${socket.id}` });

  io.emit('connection', { userList, id: socket.id });

  socket.on('sort', (list) => {
    socket.emit('sort', { userList: list, id: socket.id });
  });

  changeNickname(socket);

  message(socket);

  socket.on('disconnect', () => {
    userList = userList.filter(({ userId }) => userId !== socket.id);

    socket.broadcast.emit('disc', userList);
  });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_, res) => {
  res.render('index', { userList, messageList });
});

socketIoServer.listen(3000, () => console.log('Listening on *:3000'));
