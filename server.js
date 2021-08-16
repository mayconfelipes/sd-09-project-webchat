// Faça seu código aqui
const express = require('express');
const path = require('path');
const { name } = require('faker');

const app = express();

const socketIoServer = require('http').createServer(app);

const io = require('socket.io')(socketIoServer);

let userList = [];

const generateRandomName = () => {
  let randomName;

  while (!/^[\w'-]{16}$/.test(randomName)) {
    randomName = `${name.firstName()}-${name.lastName()}`.toLowerCase();

    if (/^[\w'-]{16}$/.test(randomName)) break;
  }

  return randomName;
};

io.on('connection', (socket) => {
  const newRandomName = generateRandomName();

  userList.push({ nickname: newRandomName, userId: `${socket.id}` });

  io.emit('connection', userList);

  console.log(userList);

  socket.emit('nickname', newRandomName);

  socket.on('changeNickname', (newNickname) => {
    socket.emit('nickname', newNickname);

    userList = userList.map(({ userId, nickname }) => (
      userId === socket.id
        ? { nickname: newNickname, userId }
        : { userId, nickname }
    ));

    io.emit('replaceUsername', userList);
  });

  socket.on('message', ({ chatMessage, nickname, currentTime }) => {
    io.emit('message', `${currentTime} - ${nickname}: ${chatMessage}`);
  });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_, res) => {
  res.render('index', { userList });
});

socketIoServer.listen(3000, () => console.log('Listening on *:3000'));
