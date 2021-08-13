const express = require('express');
// frame para configurar datas
const moment = require('moment');

const app = express();

const path = require('path');

const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  } });

const messsageModel = require('./models/message');

app.set('view engine', 'ejs');
app.set('views', './public');

const PORT = 3000;
let clients = [];

// FN para renomear o cliente
const renameClient = (socketId, nickName) => {
  const nickNameIndex = clients.findIndex((el) => el.clientId === socketId);
  const client = clients[nickNameIndex];
  client.nickName = nickName;
  return client;
};

// Deleta do array pelo Index, Funciona mas não passa no teste!
// function removeClient(socketId) {
//   console.log('cliente desconectou');
//   if (!clients) return clients;
//   const indexClient = clients.findIndex((el) => el.clientId === socketId);
//   delete clients[indexClient];
//   console.log(clients);
//   io.emit('updateOnlineUsers', (clients));
//   return clients;
// }

// FN Remove cliente
function removeClient(socketId) {
  const updateClients = clients.filter((el) => el.clientId !== socketId);
  clients = updateClients;
  io.emit('updateOnlineUsers', (clients));
  return clients;
}

// https://imasters.com.br/front-end/trabalhando-com-datas-em-javascript-com-momentjs
// FN para converter mensagem no formato
function formatMessage(chatMessage, nickname) {
  const timestamp = moment().format('DD-MM-yyyy HH:mm:ss');
  messsageModel.addMessage({ message: chatMessage, nickname, timestamp });
  const messageFormated = (`${timestamp} ${nickname}: ${chatMessage}`);
  return messageFormated;
}

// Arquivos públicos acessados pela aplicação todos arquivos Frontend
app.use(express.static(path.join(__dirname, 'public')));

// Reinderiza página ao abrir o endereço e envia histórico de mensagens
app.use('/', async (req, res) => {
  const historicMessages = await messsageModel.getAll();
  res.render('index.ejs', { historicMessages });
});

// Recebe novas conexões dos clients
io.on('connection', (socket) => {
  // console.log(`Cliente conectado ${socket.id}`);

  // recebe nickName Randômico e envia p todos
  socket.on('clientNickNameRandom', (nickNameRandom) => {
    clients.push({ clientId: socket.id, nickName: nickNameRandom });
    io.emit('updateOnlineUsers', (clients));
  });

  // Recebe nickName atualizado e envia p todos
  socket.on('nickNameUpdate', (nickName) => {
    renameClient(socket.id, nickName);
    io.emit('updateOnlineUsers', (clients));
  });

  // Recebe Novas Mensagens e Envia para Todos
  socket.on('message', ({ chatMessage, nickname }) => {
    const formatedMessage = formatMessage(chatMessage, nickname);
    io.emit('message', formatedMessage);
  });

  // Cliente desconecta
  socket.on('disconnect', () => {
    // console.log(`Cliente desconectou ${socket.id}`);
    removeClient(socket.id);
    // io.emit('updateOnlineUsers', (clients));
    // socket.emit('disconnected');
  });
});

http.listen(PORT, () => console.log(`App listening on port: ${PORT}`));