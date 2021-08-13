const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  } });

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

const messages = [];

app.use('/', (req, res) => {
  res.render('index.html');
});
  
io.on('connection', (socket) => {
  console.log(`Socket conectado com id: ${socket.id}`);

  socket.emit('previousMessage', messages);

  socket.on('message', (data) => {
    console.log(data);
    messages.push(data);
    socket.broadcast.emit('receivedMessage', data);
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});