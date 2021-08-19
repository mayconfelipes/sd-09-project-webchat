const express = require('express');
const { format } = require('date-fns');
const path = require('path');

const date = format(new Date(), 'dd-MM-yyyy hh:mm:ss');

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

const chatController = require('./controllers/chatController');

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '/view/index.html'));
});

io.on('connection', (socket) => {
  console.log(`${socket.id} is connected`);
  socket.on('message', async ({ chatMessage, nickname }) => {
    await chatController.insertMessage({ message: chatMessage, nickname, timestamp: date });
    io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
  });
});

app.get('/history', chatController.getAllMessages);

app.use(express.static('public'));

server.listen(3000, () => console.log('Escutando porta 3000'));
