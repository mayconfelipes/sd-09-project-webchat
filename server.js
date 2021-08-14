require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const ejs = require('ejs').renderFile;
const moment = require('moment');

const { PORT } = process.env;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'src', 'views', 'home')));
app.set('views', path.join(__dirname, 'src', 'views', 'home'));
app.engine('html', ejs);
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('index.html');
});

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    const dateTime = moment().format('DD-MM-YYYY HH:mm:ss');
    const msg = ` ${dateTime} - ${data.nickname}:  ${data.chatMessage}`;
    io.emit('message', msg);
    console.log(msg);
  });
});

server.listen(PORT, () => console.log(`listening on ${PORT}`));
