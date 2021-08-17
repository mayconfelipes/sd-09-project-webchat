const { getAllMessages } = require('../models/messages');
const { formatMessage } = require('../utils');

const chatController = async (_req, res) => {
    const arrayMsg = await getAllMessages();

    const messages = arrayMsg.map((msg) => (
        formatMessage(msg.timestamp, msg.nickname, msg.message)));
    
    return res.render('chat', { messages });
};

module.exports = { chatController };