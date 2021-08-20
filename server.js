const express = require('express');
const { join } = require('path');

const cors = require('cors');

const app = express();

const http = require('http').createServer(app);

// basiado no video da youtube 
// https://www.youtube.com/watch?v=-jXfKDYJJvo&t=539s

app.use(express.static(join(__dirname, 'public')));
app.set('views', join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);

// app.set('view engine', 'html');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    socket.broadcast.emit('message', data);
    socket.emit('message', data);
  });
});

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/', (_req, res) => {
  res.render('index.html');
});

// io.on('message', (data) => {
//   console.log(`socket conectado: ${data.id}`);
// });

http.listen(PORT, () => {
  console.log(`App esta escutando na porta ${PORT}`);
});
