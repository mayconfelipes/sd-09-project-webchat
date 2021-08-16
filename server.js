require('dotenv').config();
const cors = require('cors');
const app = require('express')();
const http = require('http').createServer(app);
const path = require('path');

const { PORT } = process.env;

  const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  });

  app.use(cors());

  io.on('connection', (socket) => {
    console.log('Alguém se conectou');
    socket.on('disconnect', () => {
      console.log('Alguém saiu');
    });
    socket.on('mensagem', ({ chatMessage, nickname }) => {
      const message = `data ${nickname} ${chatMessage}`;
      io.emit('message', { message });
    });
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('chatClient');
});

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
