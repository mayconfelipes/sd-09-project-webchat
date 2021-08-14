// Faça seu código aqui
const express = require('express');
const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  }
});

app.use(express.static(__dirname));

io.on('connection', (socket) => {

  socket.on('change-nickname', () => {
    console.log(`${socket.id} Alterou o nickname!`);
    io.emit('todos', 'change-nickname')
    socket.emit('pong', `PONG ##!`);
    socket.broadcast.emit('pong', `${socket.id} enviou um ping ##!`);
  });

  socket.on('send-message', () => {
    console.log(`${socket.id} enviou uma mensagem!`, socket);
    io.emit('todos', 'send-messaget')
    socket.emit('pong', `PONG ##!`);
    socket.broadcast.emit('pong', `${socket.id} enviou um ping ##!`);
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});