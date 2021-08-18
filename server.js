const express = require('express');
const moment = require('moment');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const users = [];

const getNames = () => users.map(({ nickname }) => nickname); 
io.on('connect', (socket) => {
  const newNickname = socket.id.slice(0, 16);
  users.push({ socket, nickname: newNickname });
  socket.emit('changeNickname', newNickname);
  io.emit('allUsers', getNames());

  socket.on('message', (data) => {
    const { nickname, chatMessage } = data;
    const timestamp = moment().format('DD-MM-yyyy HH:mm:ss A');
    const newMessage = `${timestamp} - ${nickname}: ${chatMessage} \n`;
    io.emit('message', newMessage);
  });

  socket.on('changeNickname', (payload) => {
    const findUser = users.find((user) => user.socket === socket); 
    findUser.nickname = payload;
    io.emit('allUsers', getNames());
  });
});
app.use(express.static(`${__dirname}/public`));

app.use('/', (_req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

server.listen(3000, () => console.log('Na porta 3000'));