import type { VercelRequest, VercelResponse } from '@vercel/node';
import client from '@/utils/redis-client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { month, day } = req.query;

  if (!month || !day) {
    return res.status(400).json({ error: 'Missing month or day parameters' });
  }

  const cacheKey = `history:${month}-${day}`;
  const cachedData = await client.get(cacheKey);

  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }

  const API_URL = `https://events.historylabs.io/date?month=${month}&day=${day}`;

  try {
    const response = await fetch(API_URL, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    await client.set(cacheKey, JSON.stringify(data), {
      EX: 3600, // Cache for 1 hour
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch history events' });
  }
}