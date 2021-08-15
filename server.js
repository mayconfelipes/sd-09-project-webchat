const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const formatData = require('./utils/formatData');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(`${__dirname}/app`));

app.get('/', (_req, res) => {
  res.sendFile('index.html'); 
});

io.on('connection', async (socket) => {
  const time = formatData();
  socket.on('serverMessage', ({ chatMessage, nickname }) => {
    console.log(nickname.length);
    console.log(`${time} -${nickname}: ${chatMessage}`);
    io.emit('message', `${time} - ${nickname}: ${chatMessage}`);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});