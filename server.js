/* eslint-disable max-lines-per-function */
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

const clients = [];
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

io.on('connection', (socket) => {
  const id = serializeId(socket.id);
  const client = {
    id,
    nickname: '',
  };

  clients.push(client);

  socket.emit('welcome', id);
  io.emit('login', id);
  
  socket.on('disconnect', () => {
    const clientToBeRemoved = clients.findIndex((cli) => cli.id === id);
    clients.splice(clientToBeRemoved, 1);

    io.emit('logout', id);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const timestamp = moment().format('DD-MM-yyyy LTS');

    io.emit('message', `${timestamp} - ${nickname || id}: ${chatMessage}`);

    ChatController.create(
      connection, ChatModel, { id, chatMessage, nickname, timestamp },
    );
  });

  socket.on('nicknameUpdate', ({ id: clientId, nickname }) => {
    const clientToBeUpdated = clients.findIndex((cli) => cli.id === id);

    clients.splice(clientToBeUpdated, 1);

    clients.push({ id: clientId, nickname });
    io.emit('nicknameUpdate', { id: clientId, nickname });
    ChatController.updateNickname(connection, ChatModel, { id: clientId, nickname });
  });
});

app.get('/', async (_req, res) => {
  const messages = await ChatController.findAll(connection, ChatModel);

  return res.render('chat', { clients, messages });
});

app.get('/chat', async (_req, res) => {
  const messages = await ChatController.findAll(connection, ChatModel);

  return res.status(200).json(messages);
});

app.get('/ping', (_req, res) => res.status(200).json({ message: 'pong' }));

server.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
