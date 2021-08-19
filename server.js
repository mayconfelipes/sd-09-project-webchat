const express = require('express');
const generateRandomAnimalName = require('random-animal-name-generator');

const app = express();
const http = require('http').createServer(app);
const path = require('path');

const dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.join(dirname, '/public')));

app.set('view engine', 'ejs');
app.set('views', './views');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const users = [];
const messages = [];

const changeNickname = ({ oldNickname, newNickname }) => {
  const i = users.findIndex((user) => user.nickname === oldNickname);
  users[i].nickname = newNickname;
};

require('./messages/connection.js')(io, users);
require('./messages/disconnect.js')(io, users);
require('./messages/message.js')(io, users, messages);
require('./messages/nickname.js')(io, changeNickname);

app.get('/', async (req, res) => {
  const animal = await generateRandomAnimalName().split(' ')[1];
  const nickname = `${animal}-anonymous`.split('', 16).join('');
  return res.status(200).render('index', { users, nickname });
});

http.listen(3000, () => { console.log('ouvindo na porta 3000'); });
