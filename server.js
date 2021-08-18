const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);

app.use(cors());
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

const ioWebChat = require('./socket/webchat');

ioWebChat(io);

const webchatController = require('./controller/webchat');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');

app.use('/', webchatController);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));