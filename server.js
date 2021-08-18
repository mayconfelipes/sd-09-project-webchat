const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const moment = require('moment');
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST', 'PUT'],
  },
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

const users = [];

const userLoginEvent = (socket) => (user) => {
  const userData = {
    nickname: user,
    userId: socket.id,
  };
  users.unshift(userData);
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
  users.map((user) => {
    if (user.userId === socket.id) {
      users.splice(users.indexOf(user), 1);
      const userUpdated = { nickname: nickName, userId: socket.id };

      return users.push(userUpdated);
    }

    return users;
  });
  io.emit('updateUserName', users);
};

io.on('connection', (socket) => {
  socket.on('userLogin', userLoginEvent(socket));

  socket.on('message', userMessageEvent(socket));

  socket.on('updateUserName', updateUserNicknameEvent(socket));
});
