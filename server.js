const express = require('express');

const app = express();
const http = require('http').createServer(app);
const dateFormat = require('dateformat');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  } });

const MessageController = require('./controllers/MessageController');
const Message = require('./models/Message');

const PORT = 3000;

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

const now = () => {
  const data = dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT');
  return data;
};

const users = {};
let nicknames = [];

const sendMessage = async (message) => {
  const dataAtual = now();
  const msg = `${dataAtual} ${message.nickname} ${message.chatMessage}`;
  io.emit('message', msg);
  await Message.create(message.chatMessage, message.nickname, dataAtual);
};

io.on('connection', (socket) => {
  const changeNickname = ({ nickname }) => {
    if (nicknames.includes(nickname) === false) {
      if (users[socket.id] !== nickname) {
        nicknames = nicknames.filter((nick) => nick !== users[socket.id]);
      }
      nicknames.push(nickname);
      users[socket.id] = nickname;
      io.emit('updateNicknames', { nicknames });
    }
  };
  socket.on('nickname', (message) => changeNickname(message));
  socket.on('message', sendMessage);
  socket.on('disconnect', () => {
    nicknames = nicknames.filter((nick) => nick !== users[socket.id]);
    users[socket.id] = undefined;
    io.emit('updateNicknames', { nicknames });
});
});

app.get('/messages', MessageController.getMessages);

http.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));

// Referências: https://github.com/tryber/sd-07-project-webchat/pull/3/files;
