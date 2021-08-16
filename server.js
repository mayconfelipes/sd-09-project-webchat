require('dotenv').config();

const { PORT = 3000 } = process.env;

const path = require('path');
const cors = require('cors');
const moment = require('moment');
const { indexOf } = require('lodash');

const bodyParser = require('body-parser').json();
const app = require('express')();
const server = require('http').createServer(app);

const sockets = [];
const serializeId = (id) => {
  const trimId = id.slice(0, 16);
  
  return trimId;
};

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser);
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization'],
  }),
);

io.on('connection', (socket) => {
  const trimId = serializeId(socket.id);
  const socketWithTrimId = { ...socket, trimId };

  sockets.push(socketWithTrimId);

  socket.on('disconnect', () => {
    sockets.splice(indexOf(socketWithTrimId), 1);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', `${moment().format('DD-MM-yyyy LTS')} - ${nickname}: ${chatMessage}`);
  });

  socket.on('nicknameUpdate', ({ target, newNickname }) => {
    io.emit('nicknameUpdate', { target, newNickname });
  });

  socket.emit('welcome', trimId);
  io.emit('login', trimId);
});

app.get('/', (_req, res) => res.render('chat', { sockets }));

app.get('/ping', (_req, res) => res.status(200).json({ message: 'pong' }));

server.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
