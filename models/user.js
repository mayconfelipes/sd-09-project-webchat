const generateNickname = () => Math.random().toString(36)
  .substring(2, 15) + Math.random().toString(36).substring(2, 7).toString();

module.exports = {
  generateNickname,
};