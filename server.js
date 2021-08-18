const express = require('express');
const moment = require('moment');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const model = require('./models/chat');

let users = [];
const getNames = () => users.map(({ nickname }) => nickname);

const messages = async (data, oi) => {
  const { nickname, chatMessage } = data;
  const timestamp = moment().format('DD-MM-yyyy HH:mm:ss A');
  const newMessage = `${timestamp} - ${nickname}: ${chatMessage} \n`;
  await model.createMessage({ message: newMessage, timestamp, nickname });

  oi.emit('message', newMessage);
};

io.on('connect', async (socket) => {
  const newNickname = socket.id.slice(0, 16);
  users.push({ socket, nickname: newNickname });
  socket.emit('changeNickname', newNickname);
  io.emit('allUsers', getNames());
  const chatMongoDB = await model.getChat();
  socket.emit('chatMongoDB', chatMongoDB);

  socket.on('message', async (data) => {
    await messages(data, io);
  });

  socket.on('changeNickname', (payload) => {
    const findUser = users.find((user) => user.socket === socket); 
    findUser.nickname = payload; io.emit('allUsers', getNames());
  });
  socket.on('disconnect', () => {
    users = users.filter((user) => user.socket !== socket);
    io.emit('allUsers', getNames());
  });
});
app.use(express.static(`${__dirname}/public`));

app.use('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

server.listen(3000, () => console.log('Na porta 3000'));