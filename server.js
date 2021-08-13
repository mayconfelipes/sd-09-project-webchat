const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const utils = require('./utils');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', async (_request, res) => {
  res.render('index');
});

io.on('connection', (socket) => {
  socket.on('message', (data) => {
   const { nickname, chatMessage } = data;
   const timestamps = utils.formatDate();

  io.emit('message', `${timestamps} - ${nickname}: ${chatMessage}`);
});
});

server.listen(3000, () => console.log('Socket running on port', 3000));
