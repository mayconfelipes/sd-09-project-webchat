const webChatModel = require('../models/webChatModel');
// controller: responsavel por indicar onde/qual funcao sera
// executada e o que sera respondido pra camada de view

const OK = 200;

const getAllMessages = async (_req, res) => {
  const messages = await webChatModel.getAllMessages();
  res.status(OK).render('webChat', { messages });
  // dados necessários para renderizar o template são passados como um objeto no segundo parâmetro
};

module.exports = {
  getAllMessages,
};
