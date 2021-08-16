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

// const connectedUsers = [];
io.on('connection', (socket) => {
  const id = crypto.randomBytes(8).toString('hex');
  // connectedUsers.push(id);
  io.emit('newUser', { id });
  socket.on('message', async ({ chatMessage, nickname }) => {
    const date = new Date();
    const finalDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`; 
    const finalTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const finalMessage = `${finalTime} ${finalDate} - ${nickname} ${chatMessage}`;
    await chatModel.postMessage({ chatMessage, timeStamp: finalTime, nickname });
    io.emit('message', finalMessage);
  });
  // socket.on('newNickname',({newNickname, oldNickname}))
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