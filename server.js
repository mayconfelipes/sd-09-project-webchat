const express = require('express');
const { join } = require('path');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http);
//   {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//   },
// }

const PORT = process.env.PORT || 3000;
// require('./sockets/chat')(io);

app.use(express.static(join(__dirname, 'public')));
app.set('views', join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);

app.use('/', (req, res) => {
  res.render('index.html');
});

const messages = [];
const nickNames = [];

const date = () => {
  const d = new Date();
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}
  ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
};

io.on('connection', (socket) => {
  socket.emit('previousMessage', messages);
  socket.emit('previousNames', nickNames);

  socket.on('message', (data) => {
    messages.push(data);
    const messageFortmat = `${date()} ${data.nickname}:${data.chatMessage}`;
    console.log(messageFortmat);
    socket.broadcast.emit('message', messageFortmat);
    socket.emit('message', messageFortmat);
  });
  
  socket.on('sendName', (data) => {
    nickNames.push(data);
    socket.broadcast.emit('receivedName', data);
  });
});

http.listen(PORT, () => {
  console.log('O Pai tá ON!!');
});
