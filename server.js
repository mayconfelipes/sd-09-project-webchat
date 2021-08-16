const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const formatData = require('./utils/formatData');
const ChatModel = require('./models/ChatModel');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(`${__dirname}/app`));

app.get('/', (_req, res) => {
  res.sendFile('index.html');
});

io.on('connection', async (socket) => {
  const timestamp = formatData();
  socket.on('message', async ({ chatMessage, nickname }) => {
    await ChatModel.saveMessages({ message: chatMessage, nickname, timestamp });
    io.emit('message', `${timestamp} - ${nickname}: ${chatMessage}`);
  });

  socket.emit('getMessages', await ChatModel.getMessages());
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});