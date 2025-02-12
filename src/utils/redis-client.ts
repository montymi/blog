import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('error', (err: Error) => console.error('Redis Client Error', err));

client.connect();

export default client;
