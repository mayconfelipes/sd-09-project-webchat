const messages = require('../models/messages');

const hello = async (req, res) => {
  res.status(200).render('chat/index', { authors: 'oi' });
};

module.exports = {
  hello,
  // listAuthors,
  // showAuthor,
  // newAuthor,
  // createAuthor,
};
