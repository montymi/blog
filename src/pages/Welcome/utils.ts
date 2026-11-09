import mix from '@/config/it-jokes';

function getRandomJoke() {
  const randomIndex = Math.round(Math.random() * (mix.length - 1));
  const randomJoke = mix[randomIndex];

  return randomJoke;
}

export { getRandomJoke };
