const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const formatData = require('./utils/formatData');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (_req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
});

io.on('connection', async (socket) => {
  const time = formatData();
  socket.on('serverMessage', ({ chatMessage, nickname }) => {
    io.broadcast.emit('message', `${time} -${nickname}: ${chatMessage}`);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});