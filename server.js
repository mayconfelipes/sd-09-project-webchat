const cors = require('cors');
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const path = require('path');

const arrayMessages = [];

const getDataHora = () => {
  const data = new Date().toLocaleDateString('pt-br').split('/').join('-');
  const hora = new Date().toLocaleTimeString('pt-br');
  return `${data} ${hora}`;
};

  const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  });

  app.use(cors());

  io.on('connection', (socket) => {
    console.log('Alguém se conectou');
    // listar histórico
    socket.emit('listAllMessages', arrayMessages);
    socket.on('disconnect', () => {
      console.log('Alguém saiu');
    });
    socket.on('message', ({ chatMessage, nickname }) => {
      const message = `${getDataHora()} - ${nickname}: ${chatMessage}`;
      arrayMessages.push(message);
      io.emit('message', { message });
    });
  });

  // caminho da pasta public será montado de acordo com o sistema operacional
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));

app.get('/', (req, res) => {
  res.render('chatClient');
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
