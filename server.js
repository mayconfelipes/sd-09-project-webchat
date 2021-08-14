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
  // socket.emit('ola', 'Mensagem enviada via socket.emit para MIM');
  // socket.broadcast.emit('ola', 'Mensagem enviada via socket.broadcast.emit para TODOS, menos EU');
  // io.emit('ola', 'Mensagem enviada via oi.emit para TODOS');
  console.log(`Usuário conectado. ID: ${socket.id} `);

  socket.on('ping', () => {
    console.log(`${socket.id} emitiu um ping!`);
    io.emit('todos', 'Mensagem enviada para TODOS via io.emit')
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