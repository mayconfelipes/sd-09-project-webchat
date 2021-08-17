const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const moment = require('moment');

const PORT = 3000;
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000/',
    method: ['GET', 'POST'],
  },
});
const { saveMessage, getMessagens } = require('./models/messagens');

app.use(cors());

const onlineUsers = [];

const aoInicializar = (socket) => {
  // criar novo usuario
  const newUser = {
    socketId: socket.id,
    nickname: `User_${String(socket.id).substring(0, 11)}`,
  };

  // enviar novo usuario ao front
  socket.emit('newUser', { newUser, onlineUsers });
  socket.on('addOn', (user) => {
    onlineUsers.push(newUser);
    console.log(user);
  });
  console.log(onlineUsers.length);

  // informar todos que esta conectrado
  socket.emit('peopleInChat', onlineUsers);

  socket.broadcast.emit('newOneInChat', newUser);

  // receber novo nicknames
  socket.on('changeNick', (newNick) => {
    newUser.nickname = newNick;
    socket.emit('user', newUser);
    socket.broadcast.emit('changeNiks', newUser);
  });
};

const sendMessage = (timestamp, nickname, chatMessage) => {
  const message = `${timestamp}-${nickname}: ${chatMessage}`;
  io.emit('message', message);
};

const salvaBD = async (message, nickname, timestamp) => {
  const saveMessa = { message, nickname, timestamp };
    await saveMessage(saveMessa);
};

io.on('connection', (socket) => {
  // remover quem sair do chat
  socket.on('disconnect', (user) => {
    onlineUsers.splice(onlineUsers.indexOf(user), 1);
    io.emit('remover', onlineUsers);
  });

  aoInicializar(socket);
  // enviar mensagens do BD
  const menssagesArray = async () => {
    const savedMessages = await getMessagens();
    const eachMessage = savedMessages
      .map((msg) => `${msg.timestamp}-${msg.nickname}: ${msg.message}`);
    socket.emit('newConnection', eachMessage);
  };
  menssagesArray();

  // receber mensagens
  socket.on('message', async ({ chatMessage, nickname }) => {
    const timestamp = moment().format('DD-MM-YYYY hh:mm:ss A');

    // enviar mensagens
    sendMessage(timestamp, nickname, chatMessage);

    // salvar no DB
    salvaBD(chatMessage, nickname, timestamp);
  });
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/front-end/index.html`);
});

http.listen(PORT, () => {
  console.log(`Servidor rodando na ${PORT}`);
});
