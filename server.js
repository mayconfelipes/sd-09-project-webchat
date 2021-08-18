require('dotenv').config();
const express = require('express');

const app = express();
const path = require('path');
const bodyParser = require('body-parser').json();

const { PORT } = process.env;

const socketServer = require('http').createServer(app);
const io = require('socket.io')(socketServer);

const messageDate = () => {
  const toLocale = new Date()
  .toLocaleDateString('pt-br', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const date = toLocale.split('/').join('-');
  const hour = new Date().toTimeString().split(' ')[0];
  return `${date} ${hour}`;
};

// o que faz quando um novo client se conecta, é conectado ao socket.io no front
io.on('connection', (socket) => {
  console.log(`Client ${socket.id} se conectou`);

  socket.on('message', ({ nickname, chatMessage }) => {
    const message = `${messageDate()} - ${nickname}: ${chatMessage}`;
    io.emit('message', message);
    return message;
  });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', (_req, res) => res.render('index.ejs'));

app.use(bodyParser);

socketServer.listen(PORT, () => console.log(`Socket na ${PORT}`));