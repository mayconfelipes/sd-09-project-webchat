// Faça seu código aqui
const express = require('express');
const path = require('path');
const moment = require('moment');

const currentTime = moment().format('DD-MM-YYYY h:mm:ss');

const app = express();

const socketIoServer = require('http').createServer(app);

const io = require('socket.io')(socketIoServer);

io.on('connection', (socket) => {
  socket.on('newUser', (userName) => {
    io.emit('addNewUser', userName);

    socket.emit('userName', userName);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', `${currentTime} - ${nickname}: ${chatMessage}`);
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public'));
});

socketIoServer.listen(3000, () => console.log('Listening on *:3000'));
