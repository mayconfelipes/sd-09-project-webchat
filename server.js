require('dotenv').config();
const cors = require('cors');
const path = require('path');
const express = require('express');

const app = express();

const PORT = 3000;

const socketIoServer = require('http').createServer(app);

const io = require('socket.io')(socketIoServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT'],
  },
});

io.on('connection', (socket) => {
  io.emit('newUser', { id: socket.id });
  socket.on('message', ({ chatMessage, nickname }) => {
    console.log(`Mensagem ${chatMessage} do ${nickname}`);
    const date = new Date();
    const finalDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`; 
    const finalTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const finalMessage = `${finalTime} ${finalDate} - ${nickname} ${chatMessage}`;
    io.emit('message', finalMessage);
  });
});

app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/', (_req, res) => {
  res.status(200).render('chat');
});

socketIoServer.listen(PORT, () => {
  console.log(`Socket.io listening on port ${PORT}`);
});