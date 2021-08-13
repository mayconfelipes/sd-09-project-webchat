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

let messages = [];

io.on('connection', (socket) => {
  console.log(`socket conectado: ${socket.id}`);
  
  socket.on('sendMessage', (data) => {
    messages.push(data);
    socket.broadcast.emit('receivedMessage', data);
  });
});

http.listen(PORT, () => {
  console.log('O Pai tá ON!!');
});
