const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const moment = require('moment');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST', 'PUT'],
  },
}, {
  pingTimeout: 500,
});
const ChatMessage = require('./models/chatMessages');
const ChatMessageControllers = require('./controller/chatMessages');

moment.updateLocale('en', {
  longDateFormat: {
      L: 'MM-DD-YYYY',
  },
});

app.use(cors());

app.set('view engine', 'ejs');

app.set('views', './views');

app.get('/', ChatMessageControllers.listMessages);

http.listen(3000, () => {
  console.log('Conectado...');
});

let users = [];

const userLoginEvent = (socket) => (user) => {
  const userData = {
    nickname: user,
    userId: socket.id,
  };
  users.push(userData);
  io.emit('userLogin', users);
};

const userMessageEvent = (socket) => (data) => {
  const { chatMessage, nickname } = data;
    const timestamp = moment().format('L LTS');
    ChatMessage.saveMessage(chatMessage, nickname, timestamp);
    const message = `${timestamp} - ${nickname}: ${chatMessage}`;
    io.emit('message', message, socket.id);
};

const updateUserNicknameEvent = (socket) => (nickName) => {
  users = users.map((user) => {
    if (user.userId === socket.id) {
      const userUpdated = { nickname: nickName, userId: socket.id };

      return userUpdated;
    }
    return user;
  });

  io.emit('updateUserName', users);
};

const userDisconnectEvent = (socket) => () => {
  users = users.filter((user) => user.userId !== socket.id);

  io.emit('userDisconnect', users);
};

io.on('connection', (socket) => {
  socket.on('userLogin', userLoginEvent(socket));

  socket.on('message', userMessageEvent(socket));

  socket.on('updateUserName', updateUserNicknameEvent(socket));

  socket.on('disconnect', userDisconnectEvent(socket));
});
