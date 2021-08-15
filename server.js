require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { format } = require('date-fns');

const app = express();
const http = require('http').createServer(app);

const timestamp = format(new Date(), 'dd-MM-yyyy HH:mm:ss');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

const db = require('./models/messages');
const chatControllers = require('./controllers/chatControllers');

let userList = [];

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/view/index.html'));
});

io.on('connection', (socket) => {
  io.emit('userList', socket.id);
  socket.on('createUser', (userName) => {
    userList.push({ id: socket.id, userName });
    io.emit('userListConnect', userList);
  });
  socket.on('updateUserName', (nameInfos) => {
   userList.find((user) => user.userName === nameInfos.old).userName = nameInfos.new;
    io.emit('updateUserName', userList);
  });
  socket.on('message', async ({ chatMessage, nickname }) => {
    io.emit('message', `${timestamp} ${nickname}: ${chatMessage}`);
    await db.post({ chatMessage, nickname, timestamp });
  });
  socket.on('disconnect', () => {
    userList = userList.filter(({ id }) => id !== socket.id);
    io.emit('updateListDisconnect', userList);
  });
});

app.get('/history', chatControllers.getAll);

app.use(express.static('public'));

http.listen(3000, () => console.log('Pai ta on na porta 3000'));
