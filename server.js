// Faça seu código aqui
const express = require('express');
const path = require('path');

const app = express();

const socketIoServer = require('http').createServer(app);

const io = require('socket.io')(socketIoServer);

// io.on('connection', (socket) => {});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public'));
});

socketIoServer.listen(3000, () => console.log('Listening on *:3000'));
