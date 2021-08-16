const crypto = require('crypto');

function genereteNick() {
    const nickName = crypto.randomBytes(8).toString('hex'); // Código retirado do site https://stackoverflow.com/questions/9407892/how-to-generate-random-sha1-hash-to-use-as-id-in-node-js/14869745#14869745
    return nickName;
}

module.exports = genereteNick;
