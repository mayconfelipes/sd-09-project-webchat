require('dotenv').config();
// const path = require('path');
const express = require('express');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const chatController = require('./controllers/chatController');
const ioChat = require('./socket/messages');

const PORT = process.env.PORT || 3000;

ioChat(io);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', chatController);

http.listen(PORT, () => console.log('servidor na porta 3000'));