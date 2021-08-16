// Faça seu código aqui
const express = require('express');
const path = require('path');
const moment = require('moment');
const { name } = require('faker');

const currentTime = moment().format('DD-MM-YYYY h:mm:ss');

const app = express();

const socketIoServer = require('http').createServer(app);

const io = require('socket.io')(socketIoServer);

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

  io.emit('connection', { randomName: newRandomName, userId: `${socket.id}` });

  socket.on('newUser', (userName) => {
    io.emit('replaceUsername', { userName, userId: `${socket.id}` });
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit(
      'message',
      `${currentTime} - ${nickname}: ${chatMessage}`,
    );
  });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_, res) => {
  res.render('index');
});

socketIoServer.listen(3000, () => console.log('Listening on *:3000'));
