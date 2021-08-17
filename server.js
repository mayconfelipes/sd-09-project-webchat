require('dotenv').config();
const cors = require('cors');
const path = require('path');
const express = require('express');
const crypto = require('crypto');

const app = express();

const PORT = 3000;

const socketIoServer = require('http').createServer(app);

const io = require('socket.io')(socketIoServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT'],
  },
});
const chatController = require('./controllers/chat');
const chatModel = require('./models/chat');

const messageFunc = async (chatMessage, nickname) => {
  const date = new Date();
  const finalDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`; 
  const finalTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const finalMessage = `${finalTime} ${finalDate} - ${nickname} ${chatMessage}`;
  await chatModel.postMessage({ chatMessage, timeStamp: finalTime, nickname });
  io.emit('message', finalMessage);
};
const connectedUsers = [];
io.on('connection', (socket) => {
  const id = crypto.randomBytes(8).toString('hex');
  connectedUsers.push({ socketId: socket.id, nickname: id });
  io.emit('newUser', { connectedUsers, id: socket.id });
  socket.on('message', ({ chatMessage, nickname }) => {
    messageFunc(chatMessage, nickname);
  });
  socket.on('newNickname', ({ newNickname }) => {
    const index = connectedUsers.findIndex(({ socketId }) => socketId === socket.id);
    connectedUsers.splice(index, 1, { socketId: socket.id, nickname: newNickname });
    io.emit('users', { connectedUsers, id: socket.id });
  });
  socket.on('disconnect', () => {
    connectedUsers.splice(connectedUsers.findIndex(({ socketId }) => socketId === socket.id), 1);
    io.emit('users', { connectedUsers, id: false });
  });
});
// teste
app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/', chatController.chatView);
// app.get('/', (_req, res) => {
//   res.status(200).render('chat', { messages });
// });

socketIoServer.listen(PORT, () => {
  console.log(`Socket.io listening on port ${PORT}`);
});