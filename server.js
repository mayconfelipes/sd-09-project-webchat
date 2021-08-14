require('dotenv').config();

const { PORT = 3000 } = process.env;

const path = require('path');
const cors = require('cors');
const moment = require('moment');

const bodyParser = require('body-parser').json();
const app = require('express')();
const server = require('http').createServer(app);

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
  console.log('Alguém se conectou');

  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', `${moment().format('DD-MM-yyyy LTS')} - ${nickname}: ${chatMessage}`);
  });
});

app.get('/', (_req, res) => res.render('chat'));

app.get('/ping', (_req, res) => res.status(200).json({ message: 'pong' }));

server.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
