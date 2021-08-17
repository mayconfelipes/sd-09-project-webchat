const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const app = express();

const httpServer = http.createServer(app);
// http é o modelo do node que lida com tudo que tem a ver com http (como um 'fs'para http)
// aqui o createServer vai registrar uma funcao que vai tratar futuros pacotes http
// quando dermos o '.listen' o node informa pro sistema que quer receber os pacotes daquela porta,
// ai ele trata os pacotes e passa pra funcao (o app por exemplo é uma função e por isso passamos pro createServer)

app.use(cors());
// cors vai deifinir qual endereço podem acessar e quais métodos/headers ele aceita!

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    // endereço onde o front tá rodando, de onde vem as requisicoes
    method: ['GET', 'POST'],
  },
});

const webChatRouter = require('./routes/webChatRouter');
const ioWebChat = require('./socket/webChatSocket');

ioWebChat(io);

app.use('/', webChatRouter);

app.set('view engine', 'ejs');
// configurando o express para utilizar o EJS por padrão como template engine
app.set('views', './views');
// adiciona o diretório /views à lista de diretórios em que o expresss vai procurar um arquivo
// com o nome especificado pelo método render -> não precisa especificar o caminho completo do arquivo

const PORT = process.env.PORT || 3000;
// PORT será 3001 porque o front-end vai rodar na 3000

httpServer.listen(PORT, () => console.log(`listening on port ${PORT}`));
