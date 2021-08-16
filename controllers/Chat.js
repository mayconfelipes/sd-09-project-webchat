const HTTP_OK = 200;

const getChat = (_req, res, next) => {
  try {
    res.status(HTTP_OK).render('Chat', { });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getChat,
};
