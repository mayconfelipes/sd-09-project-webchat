const express = require('express');

const app = express();
const http = require('http');
const path = require('path');
const { format } = require('date-fns');

const timestamp = format(new Date(), 'dd-MM-yyyy HH:mm:ss');

const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/chat.html'));
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('message', ({ nickname, chatMessage }) => {
    io.emit('message', `${timestamp} - ${nickname}: ${chatMessage}`);
  });
});

// require('./socket/chat')(io);

server.listen(3000, () => {
  console.log('listening on *:3000');
});