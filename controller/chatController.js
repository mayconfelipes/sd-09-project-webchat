const { genereteNick } = require('../utils');

const chatController = (_req, res) => {
    const nickName = genereteNick();
    return res.render('chat', { nickName });
};

module.exports = { chatController };