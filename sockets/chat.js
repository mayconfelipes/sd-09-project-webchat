const moment = require('moment');
const historicMessage = require('../models/historicMessage');

let clients = [];
const data = () => moment().format('DD-MM-yyyy HH:mm:ss'); // gerador de datas

const getMessages = async () => historicMessage.historicMessage()
    .then((msn) => msn.map((m) => `${m.timestamp} ${m.nickname} ${m.message}`));

module.exports = (io) => io.on('connection', async (socket) => {
  let clientName = socket.id.slice(0, 16);
  socket.on('message', ({ chatMessage, nickname }) => {
    historicMessage.saveMessage({ message: chatMessage, nickname, timestamp: data });
    io.emit('message', `${data()} ${nickname} ${chatMessage}`);
  });
  socket.on('user', (nickname) => {
    clients = clients.map((client) => (client === clientName ? nickname : client));
    clientName = nickname; io.emit('clientsConnect', clients);
  });
  const messages = await getMessages();
  socket.emit('messages', messages);
  socket.emit('nicknameSlice', clientName);
  clients.push(clientName);
  io.emit('clientsConnect', clients);
  socket.on('disconnect', () => {
    clients = clients.filter((client) => client !== clientName);
    io.emit('clientsConnect', clients);
  });
});

// Cada conexão(usuário) cria-se "pacote"(socket) que troca o nickname, coloca o tempo e envia mensagem,
// além disso, o servidor mostra à todos os servidores quem entrou e as mudanças de nickname