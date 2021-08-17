require('dotenv').config();

const { PORT = 3000 } = process.env;

const path = require('path');
const cors = require('cors');
const moment = require('moment');
const socketIO = require('socket.io');

const bodyParser = require('body-parser').json();
const app = require('express')();
const server = require('http').createServer(app);

const connection = require('./models/connection');
const ChatController = require('./controllers/Chat');
const ChatModel = require('./models/Chat');

const sockets = [];
const serializeId = (id) => {
  const trimId = id.slice(0, 16);

  return trimId;
};

const io = socketIO(server, {
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

app.get('/', async (_req, res) => {
  const messages = await ChatController.findAll(connection, ChatModel);

  return res.render('chat', { sockets, messages });
});

app.get('/chat', async (_req, res) => {
  const messages = await ChatController.findAll(connection, ChatModel);

  return res.status(200).json(messages);
});

app.get('/ping', (_req, res) => res.status(200).json({ message: 'pong' }));

io.on('connection', (socket) => {
  const trimId = serializeId(socket.id);
  const socketWithTrimId = { ...socket, trimId };

  sockets.push(socketWithTrimId);

  socket.on('disconnect', () => {
    sockets.splice(sockets.indexOf(socketWithTrimId), 1);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const timestamp = moment().format('DD-MM-yyyy LTS');

    ChatController.create(
      connection, ChatModel, { chatMessage, nickname, timestamp },
    );

    io.emit('message', `${timestamp} - ${nickname}: ${chatMessage}`);
  });

  socket.on('nicknameUpdate', ({ target, newNickname }) => {
    io.emit('nicknameUpdate', { target, newNickname });
  });

  socket.emit('welcome', trimId);
  io.emit('login', trimId);
});

server.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
