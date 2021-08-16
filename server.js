const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

const PORT = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.use('/', (_req, res) => {
res.render('index.html');
});

const messages = [];

io.on('connection', (socket) => {
  console.log(`socket conectado com o ID: ${socket.id}`);
  // gerando nick para o req2
  const geranick = (id) => {
    if (id) { socket.emit('newnick', id.slice(0, 16)); }
    return false;
  };  
    
  geranick(socket.id);
  // enviando historico de mensagens ao front.
  socket.emit('previousmessage', messages);
 
  // esperando evento message in
  socket.on('message', ({ chatMessage, nickname }) => { 
    const time = new Date();
    const timeLocal = time.toLocaleString('pt-BR').replace(' ', '/').split('/').join('-');
    const payload = `${timeLocal} - ${nickname}: ${chatMessage}`;
  
    messages.push(payload);
   
    // message out a todos os clientes
    io.emit('message', payload);
  });
});
  // a porta deve ser atribuida por process.env?
server.listen(PORT, () => console.log('Express escutando na porta 3000'));
