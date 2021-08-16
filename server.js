const express = require('express');
const moment = require('moment');

const app = express();
const cors = require('cors');
const path = require('path');

const http = require('http').createServer(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.use(cors());

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Usuário: ${socket.id}`);

  socket.on('message', (message) => {
    const time = moment().format('DD-MM-yyyy h:mm:ss A');
    io.emit('message', `${time} - ${message.nickname}: ${message.chatMessage}`);
  });
});

app.get('/', (_req, res) => res.render('index'));

const PORT = 3000;

http.listen(PORT, () => console.log(`Online na Porta: ${PORT}`));