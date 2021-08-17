const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');

require('dotenv').config();

const PORT = 3000;
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const chatController = require('./controller/webchat');

const currentTime = () => {
  const data = new Date();
  const d = String(data.getDate()).padStart(2, '0');
  const m = String(data.getMonth()).padStart(2, '0');
  const a = String(data.getFullYear());
  const h = String(data.getHours());
  const mi = String(data.getMinutes()).padStart(2, '0');
  const s = String(data.getSeconds()).padStart(2, '0');

  return `${d}-${m}-${a} ${h}:${mi}:${s}`;
};

const findSocketId = (array, sockedId) => {
  let returnValue;
  array.forEach((item, index) => {
    if (item.socket === sockedId) {
      returnValue = index;
    }
  });
  return returnValue;
};

const findGuest = (array, guest) => {
  let returnValue;
  array.forEach((item, index) => {
    if (item.guest === guest) {
      returnValue = index;
    }
  });
  return returnValue;
};

const guests = [];
let guest;
        
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const saveMessage = async () => {

};

const sendMessage = (message) => {
  const { nickname, chatMessage } = message;
  const timestamp = currentTime();
  const completeMessage = `${timestamp} - ${nickname}: ${chatMessage}`;
  io.emit('message', completeMessage);
  saveMessage(chatMessage, nickname, timestamp);
  chatController.create({ message: chatMessage, nickname });
};

const getAll = async () => {
  const allMessages = await chatController.getAll();
  io.emit('bdMessages', allMessages);
  return allMessages;
};

io.on('connection', (socket) => {
  guest = crypto.randomBytes(8).toString('hex');
  guests.push({ guest, socket: socket.id });
  socket.emit('user', guests, guest);
  socket.broadcast.emit('users', guests);
  // io.emit('users', guests);
  getAll();
  
  socket.on('message', (message) => sendMessage(message));

  socket.on('changeNikname', (nickname) => {
    const { newNickname, oldNickname } = nickname;
    guests[findGuest(guests, oldNickname)].guest = newNickname;
    socket.broadcast.emit('updadeUsers', guests);
    // io.emit('updadeUsers', guests);
  });

  socket.on('disconnect', () => {
    const userIndex = findSocketId(guests, socket.id);
    const userExit = guests[userIndex].guest;
    guests.splice(userIndex, 1);
    socket.broadcast.emit('exitUser', guests, userExit);
    // io.emit('exitUser', guests, userExit);
  });
});

app.get('/', chatController.chat);

http.listen(PORT, () => [
  console.log(`Servidor online na porta ${PORT}`),
]);
