// backend

const express = require('express');
const { format } = require('date-fns');
const path = require('path');

const date = format(new Date(), 'dd-MM-yyyy hh:mm:ss');

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

const chatController = require('./controllers/chatController');

let usersArr = [];

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '/view/index.html'));
});

io.on('connection', (socket) => {
  console.log(`${socket.id} is connected`);
  socket.on('message', async ({ chatMessage, nickname }) => {
    await chatController.insertMessage({ message: chatMessage, nickname, timestamp: date });
    io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
  });
  socket.on('createUserNickname', (nickname) => {
    usersArr.push({ id: socket.id, nickname });
    io.emit('showUserList', usersArr);
  });
  // a linha a seguir se refere ao "disconnectedUserList" do frontend:
  socket.on('disconnect', () => {
    usersArr = usersArr.filter((user) => user.id !== socket.id);
    io.emit('disconnectedUserList', usersArr);
  });
  socket.on('updateUserNickname', (userNickname) => {
    usersArr.find((user) => user.id === socket.id).nickname = userNickname;
    io.emit('updateUserNickname', usersArr);
  });
});

app.get('/history', chatController.getAllMessages);

app.use(express.static('public'));

server.listen(3000, () => console.log('Escutando porta 3000'));
