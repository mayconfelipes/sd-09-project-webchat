const webChatModel = require('../models/webChatModel');
// controller: responsavel por indicar onde/qual funcao sera
// executada e o que sera respondido pra camada de view

const OK = 200;

const getAllMessages = async (_req, res) => {
  const messages = await webChatModel.getAllMessages();
  const history = messages.map(({ message, nickname, timestamp }) =>
    `${timestamp} - ${nickname}: ${message}`);
  res.status(OK).render('webChat', { history });
  // dados necessários para renderizar o template são passados como um objeto no segundo parâmetro
};

module.exports = {
  getAllMessages,
};
