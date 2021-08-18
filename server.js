const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');

const ioWebChat = require('./socket/webchat');

ioWebChat(io);

const webchatModel = require('./models/webchat');

app.get('/', async (_req, res) => {
  const messages = await webchatModel.getAllMessages();
  const history = messages.map(({ message, nickname, timestamp }) =>
    `${timestamp} - ${nickname}: ${message}`);
  res.status(200).render('index.ejs', { history });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));