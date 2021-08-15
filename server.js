const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const { PORT, SOCKET_PORT } = process.env;

const socketIoServer = require('http').createServer();
const io = require('socket.io')(socketIoServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const chatController = require('./controller/chat');

const currentTime = () => {
  const data = new Date();
  const d = String(data.getDate()).padStart(2, '0');
  const m = String(data.getMonth()).padStart(2, '0');
  const a = String(data.getFullYear());
  const h = String(data.getHours());
  const mi = String(data.getMinutes()).padStart(2, '0');
  const s = String(data.getSeconds()).padStart(2, '0');

  return `${d}-${m}-${a} ${h}:${mi}:${s}`;
};

const guests = [];
let indexGest = 0;          

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization'],
  }),
);

io.on('connection', (socket) => {
  indexGest += 1;
  console.log(`Guest${indexGest} conectado`);
  console.log(guests);
  guests.push(`Guest${indexGest}`);
  socket.emit('user', `Guest${indexGest}`);
  socket.broadcast.emit('newUser', `Guest${indexGest}`);

  socket.on('message', (message) => {
    const { nickname, chatMessage } = message;
    const completeMessage = `${currentTime()} - ${nickname}: ${chatMessage}`;
    io.emit('message', completeMessage);
  });
});

app.get('/', chatController.chat);

app.listen(PORT, () => [
  console.log(`Servidor online na porta ${PORT}`),
]);

socketIoServer.listen(SOCKET_PORT, () => {
  console.log(`Servidor Socket.io online na port ${SOCKET_PORT}`);
});
