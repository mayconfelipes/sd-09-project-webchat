const getEl = (id) => document.getElementById(id);

const inputName = getEl('input_name');
const saveName = getEl('save_name');
const clientsArea = getEl('text_area_clients');
const inputMessages = getEl('input_messages');
const sendMessage = getEl('send_message');
const messagesArea = getEl('text_area_messages');

inputName.addEventListener('change', () => {
  console.log('to funfando - inputname');
});
saveName.addEventListener('click', () => {
  console.log('to funfando - savename');
});
clientsArea.addEventListener('change', () => {
  console.log('to funfando- clientsaerea');
});
inputMessages.addEventListener('change', () => {
  console.log('to funfando - inputmessage');
});

sendMessage.addEventListener('click', () => {
  console.log('to funfando - senmessage');
});
messagesArea.addEventListener('change', () => {
  console.log('to funfando- messagearea');
});