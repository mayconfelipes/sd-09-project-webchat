require('dotenv').config();

const crypto = require('crypto');
const path = require('path');
const express = require('express');
const { format } = require('date-fns');

const app = express();
const http = require('http').createServer(app);

const users = {};
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  } });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

io.on('connection', (socket) => {
  socket.on('newUser', (callback) => {
    const nickname = crypto.randomUUID().substring(0, 16);
    users[socket.id] = nickname;
    callback({ nickname });
    io.emit('updateUsers', { users });
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('updateUsers', { users });
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const date = format(new Date(), 'dd-MM-yyy hh:mm:ss a');
    io.emit('message', `${date} ${nickname} ${chatMessage}`);
  });

  socket.on('updateNickname', ({ nickname }) => {
    users[socket.id] = nickname;
    io.emit('updateUsers', { users });
  });
});

const port = process.env.PORT || 3000;

http.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});