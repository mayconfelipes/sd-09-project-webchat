const chatController = (_req, res) => {
    res.render('chat', { msg: 'teste ejs' });
};

module.exports = { chatController };