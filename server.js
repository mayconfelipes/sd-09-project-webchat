const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { format } = require('date-fns');

const app = express();
const http = require('http').createServer(app);

const timestamp = format(new Date(), 'dd-MM-yyyy HH:mm:ss');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/view/index.html'));
});

io.on('connection', (socket) => {
  console.log(`Usuário conectado. ID: ${socket.id}`);
  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', `${timestamp} ${nickname}: ${chatMessage}`);
  });
});

app.use(express.static('public'));

http.listen(3000, () => console.log('Pai ta on na porta 3000'));
