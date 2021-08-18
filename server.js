require('dotenv').config();
const path = require('path');
const express = require('express');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const ioChat = require('./socket/messages');

const PORT = process.env.PORT || 3000;

ioChat(io);

app.get('/', (_, res) => res.sendFile(path.join(__dirname, '/views/index.html')));
// app.use('/', chatController);

http.listen(PORT, () => console.log('servidor na porta 3000'));