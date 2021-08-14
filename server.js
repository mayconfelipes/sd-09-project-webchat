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
const messagesController = require('./controller/messages');

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
  guests.push(`Guest${indexGest}`);
});

// io.on('disconnect', (socket) => {

// });

app.get('/', chatController.chat);

app.post('/messages', (req, res, _next) => {
  io.emit('notification', req.body);
  res.status(200).json({ message: 'Notícia adicionada' });
});

app.listen(PORT, () => [
  console.log(`Servidor online na porta ${PORT}`),
]);

socketIoServer.listen(SOCKET_PORT, () => {
  console.log(`Servidor Socket.io online na port ${SOCKET_PORT}`);
});
