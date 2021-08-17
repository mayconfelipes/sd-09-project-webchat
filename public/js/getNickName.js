const adjectives = [
  'lord', 'master', 'adorable', 'short', 'kind', 'tired', 'caring', 'fearless', 'funny',
  'joyful', 'friendly', 'tall', 'short', 'handsome', 'determined', 'smart', 'studious', 'faithful',
  'handy', 'honest', 'naive', 'insecure', 'fair', 'modest', 'neurotic', 'optimistic', 'daring',
  'patient', 'romantic', 'nice', 'lucky', 'talented', 'shy'];

const names = ['Carla', 'Tom', 'Jay', 'Martin', 'Sharon', 'Gustav', 'Wesley', 'Harry', 'Victor',
  'Lorran', 'Brayan', 'Giulia', 'Karine', 'Ingrid', 'Yasmin', 'Emilly', 'Samara', 'Lilian',
  'Ashley', 'Agatha', 'Hellen', 'Arna', 'Alyssa'];

const getNickName = () => {
  const random = (num) => Math.floor(Math.random() * num);
  const randomAdj = adjectives[random(adjectives.length)];
  const randonName = names[random(names.length)];
  let nick = `${randomAdj}${randonName}`;
  while (nick.length < 16) {
    nick += random(9);
  }
  return nick;
};

localStorage.setItem('nickname', getNickName());
