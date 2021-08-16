function formatMessage(date, nick, message) {
    return `${date} - ${nick}: ${message}`;
}

module.exports = formatMessage;
