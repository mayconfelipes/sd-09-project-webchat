const express = require('express');
const moment = require('moment');

const app = express();
const cors = require('cors');
const path = require('path');

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
  },
});

const chatModel = require('./models/chatModel');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.use(cors());

const users = {};

io.on('connection', async (socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const timestamp = moment().format('DD-MM-yyyy h:mm:ss A');
    await chatModel.setMessages({ message: chatMessage, nickname, timestamp });
    io.emit('message', `${timestamp} - ${nickname}: ${chatMessage}`);
  });
  socket.emit('getMessages', await chatModel.getMessages());

  socket.broadcast.on('nickname', (nickname) => {
    users[socket.id] = nickname;
    io.emit('nickname', Object.values(users));
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    socket.broadcast.emit('userDisconnect', Object.values(users));
  });
});

app.get('/', (_req, res) => res.render('index'));

const PORT = 3000;

http.listen(PORT, () => console.log(`Online na Porta: ${PORT}`));