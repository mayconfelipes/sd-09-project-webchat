// Faça seu código aqui
const app = require('express')();
const cors = require('cors');
const express = require('express');
const http = require('http').createServer(app);
const path = require('path');
const moment = require('moment');

const PORT = 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

app.use(cors());
const chatController = require('./controller/chatController');

io.on('connection', async (socket) => {
  console.log(`${socket.id} se conectou`);
  
  const chatHistory = await chatController.getAll();
  chatHistory.forEach(({ timestamp, nickname, message }) => {
    socket.emit('message', `${timestamp} - ${nickname}: ${message}`);
  });
  socket.emit('newConnection', 'Seja bem vindo ao Trybe Webchat');
  socket.on('disconnect', () => console.log(`${socket.id} se desconectou`));
  socket.on('message', async ({ chatMessage, nickname }) => {
    const now = new Date();
    const time = moment(now).format('DD-MM-YYYY HH:MM');
    const newMessage = `${time} - ${nickname}: ${chatMessage}`;
    io.emit('message', newMessage);
    await chatController.saveMessage(chatMessage, nickname, time);
  });
});

app.use(express.static(path.join(__dirname, '/public/')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/chat.html')));

http.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));