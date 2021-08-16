module.exports = (stringLenght) => {
  let nickNameRandom = '';
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 1; i <= stringLenght; i += 1) {
    nickNameRandom += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }

  return nickNameRandom;
};
