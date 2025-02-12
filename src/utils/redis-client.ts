import { createClient } from 'redis';

const client = createClient({
  url: process.env.VITE_REDIS_URL,
});

client.on('error', (err: Error) => console.error('Redis Client Error', err));

client.connect();

export default client;
