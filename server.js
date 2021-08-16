const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const socket = require('socket.io');
const connect = require('./socket/chat');

const io = socket(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

connect(io);

app.use(express.static(path.join(__dirname, 'views')));

http.listen(3000, () => {
  console.log('Funcionando');
});
