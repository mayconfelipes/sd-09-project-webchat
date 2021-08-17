const cors = require('cors');
const app = require('express')();
const http = require('http').createServer(app);
const path = require('path');

const arrayMessages = [];

const getDataHora = () => {
  const data = new Date().toLocaleDateString('pt-br').split('/').join('-');
  const hora = new Date().toLocaleTimeString('pt-br');
  return `${data} ${hora}`;
};

// Fonte: https://qastack.com.br/programming/1349404/generate-random-string-characters-in-javascript
const createNickname = (qtdWorks) => {
  let nickName = '';
     while (nickName.length < qtdWorks) {
      nickName += Math.random().toString(36).substr(2, qtdWorks - nickName.length);
    }
   return nickName;
};

  const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  });

  app.use(cors());

  io.on('connection', (socket) => {
    console.log('Alguém se conectou');
    // emitindo para o Front o Nickname
    socket.emit('createNickname', createNickname(16));
    // listar histórico
    socket.emit('listAllMessages', arrayMessages);
    socket.on('disconnect', () => {
      console.log('Alguém saiu');
    });
    socket.on('message', ({ chatMessage, nickname }) => {
      const message = `${getDataHora()} ${nickname} ${chatMessage}`;
      arrayMessages.push(message);
      io.emit('message', { message });
    });
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('chatClient');
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
