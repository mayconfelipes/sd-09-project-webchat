const express = require('express');
const { join } = require('path');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http,
  {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.static(join(__dirname, 'public')));
app.set('views', join(__dirname, 'public'));
//  Um diretório ou uma matriz de diretórios para as visualizações do aplicativo.
//  Se for uma matriz, as visualizações são pesquisadas na ordem em que ocorrem na matriz.
//  https://stackoverflow.com/questions/29961711/app-setviews-dirname-views-in-express-node-js
app.engine('html', require('ejs').renderFile);
//  Agora você pode usar o mecanismo de visualização ejs, mantendo seus arquivos de visualização como .html
//  https://stackoverflow.com/questions/17911228/how-do-i-use-html-as-the-view-engine-in-express

app.use('/', (req, res) => {
  res.render('index.html');
});

require('./sockets/server-messages')(io);
require('./sockets/server-names')(io);

http.listen(PORT, () => {
  console.log('O Pai tá ON!!');
});
