const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
const {
  fromDb,
  insertOne,
} = require('./models/midwaresFunction'); 
// const { promiseImpl } = require('ejs');

const PORT = 3000;
const time = new Date();
const timeLocal = time.toLocaleString('pt-BR').replace(' ', '/').split('/').join('-');
const online = [];

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.use('/', (_req, res) => {
res.render('index.html');
});

io.on('connection', async (socket) => {
  console.log(`socket conectado com o ID: ${socket.id}`);
  const message = await fromDb();
  // gerando nick para o req2
  const geranick = (id) => {
    online.push(id.slice(0, 16));
    if (id) { io.emit('newnick', online); } return 'connected';
  };  
  geranick(socket.id);
  console.log('online', online);
  // enviando historico de mensagens ao front.
  
  socket.emit('previousmessage', message);

  socket.on('nickchanged', ({ old, neo }) => {
    socket.broadcast.emit('changenick', { neo, old }); 
});

  // esperando evento message in
  socket.on('message', ({ chatMessage, nickname }) => { 
    const payload = `${timeLocal} - ${nickname}: ${chatMessage}`;
    const objmess = { timestamp: timeLocal, nickname, message: chatMessage };
    insertOne(objmess);
   
    // message out a todos os clientes
    io.emit('message', payload);
  });
});
  // a porta deve ser atribuida por process.env?
server.listen(PORT, () => console.log('Express escutando na porta 3000'));
