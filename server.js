const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const moment = require('moment');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST', 'PUT'],
  },
});

app.use(cors());

app.set('view engine', 'ejs');

app.set('views', './views');

app.get('/', (req, res) => {
  res.status(200).render('chat');
});

http.listen(3000, () => {
  console.log('Conectado...');
});

// Emitindo e recebendo eventos
io.on('connection', (socket) => {
  socket.on('userLogin', (user) => {
    io.emit('userLogin', user);
  });

  // recebendo
  socket.on('message', (data) => {
    const { chatMessage, nickname } = data;

    const message = `${moment().format('L LTS')} - ${nickname}: ${chatMessage}`;

    io.emit('message', message);
  });
});