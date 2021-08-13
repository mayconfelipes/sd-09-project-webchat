const getEl = (id) => document.getElementById(id);

const inputName = getEl('input_name');
const saveName = getEl('save_name');
const clientsArea = getEl('text_area_clients');
const inputMessages = getEl('input_messages');
const sendMessage = getEl('send_message');
const messagesArea = getEl('text_area_clients');

inputName.addEventListener('change', () => {
  console.log('to funfando');
});
saveName.addEventListener('click', () => {
  console.log('to funfando');
});
clientsArea.addEventListener('change', () => {
  console.log('to funfando');
});
inputMessages.addEventListener('change', () => {
  console.log('to funfando');
});
sendMessage.addEventListener('clcik', () => {
  console.log('to funfando');
});
messagesArea.addEventListener('change', () => {
  console.log('to funfando');
});