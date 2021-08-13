const express = require('express');
const cors = require('cors');
const http = require('http');
const { format } = require('date-fns');
require('dotenv').config();

const app = express();

app.use(cors());

const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Usuario ${socket.id} conectado.`);

  socket.on('message', ({ nickname, chatMessage }) => {
    const date = format(new Date(), 'dd-MM-yyyy HH:mm:ss');
    io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
  });

  socket.on('disconnect', () => {
    console.log(`Usuario ${socket.id} desconectou`);
  });
});

httpServer.listen(process.env.PORT || 3000, () => (
  console.log(`Ouvindo na porta ${process.env.PORT}`)
));