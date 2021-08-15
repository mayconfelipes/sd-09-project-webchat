const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');

require('dotenv').config();

const { PORT } = process.env;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const chatController = require('./controller/chat');

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

const guests = [];
let guest;
        
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// eslint-disable-next-line max-lines-per-function
io.on('connection', (socket) => {
  guest = crypto.randomBytes(8).toString('hex');
  console.log(`${guest} conectado`);
  guests.push(guest);
  socket.emit('user', guest);
  socket.emit('users', guests);

  socket.on('message', (message) => {
    const { nickname, chatMessage } = message;
    const completeMessage = `${currentTime()} - ${nickname}: ${chatMessage}`;
    io.emit('message', completeMessage);
  });

  socket.on('changeNikname', (nickname) => {
    const { newNickname, oldNickname } = nickname;
    console.log(nickname);
    guests[guests.indexOf(oldNickname)] = newNickname;
    socket.broadcast.emit('newUser', guests);
  });

  socket.on('disconnect', () => {
    console.log('usuario saiu');
  });
});

app.get('/', chatController.chat);

http.listen(PORT, () => [
  console.log(`Servidor online na porta ${PORT}`),
]);
