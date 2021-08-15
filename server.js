require('dotenv').config();
const path = require('path');
const express = require('express');

const app = express();
const http = require('http').createServer(app);

const users = {};
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  } });

const MessageModel = require('./models/message');
const UserModel = require('./models/user');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

io.on('connection', (socket) => {
  socket.on('newUser', (callback) => {
    MessageModel.findAll().then((messageHistory) => {
      users[socket.id] = UserModel.generateNickname();
      callback({ nickname: users[socket.id], messageHistory });
      io.emit('updateUsers', { users });
    });
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('updateUsers', { users });
  });

  socket.on('message', (chatMessage) => MessageModel.create(chatMessage, users[socket.id])
    .then(({ message, nickname, timestamp }) =>
      io.emit('message', `${timestamp} ${nickname} ${message}`)));

  socket.on('updateNickname', ({ nickname }) => {
    users[socket.id] = nickname;
    io.emit('updateUsers', { users });
  });
});

const port = process.env.PORT || 3000;

http.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});