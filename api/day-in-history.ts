import type { Request, Response as ExpressResponse } from 'express';

export interface HistoryEvent {
  year: number;
  content: string;
}

export const fetchHistoryEvents = async (month: number, day: number): Promise<HistoryEvent[]> => {
  const response = await fetch(`/api/date?month=${month}&day=${day}`);
  if (!response.ok) {
    console.error('Failed to fetch events in fetchHistoryEvents');
    throw new Error('Failed to fetch events');
  }
  const data = (await response.json()) as { events: HistoryEvent[] };
  return data.events;
};

const fetchWithRetry = async (
  url: string,
  retries: number = 3,
  delay: number = 1000,
): Promise<globalThis.Response> => {
  console.log(`fetchWithRetry called for url: ${url}`);
  for (let i = 0; i < retries; i++) {
    console.log(`Attempt ${i + 1} for url: ${url}`);
    const response = await fetch(url, { mode: 'cors' });
    console.log(`Response status on attempt ${i + 1}: ${response.status}`);
    if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
      const resetTime = response.headers.get('X-RateLimit-Reset');
      const waitTime = resetTime ? parseInt(resetTime) * 1000 - Date.now() : delay;
      console.warn(`Rate limited. Waiting for ${waitTime}ms before retrying...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    } else {
      return response;
    }
  }
  console.error('Exceeded maximum retries due to rate limiting');
  throw new Error('Rate limit exceeded');
};

export default async (req: Request, res: ExpressResponse) => {
  console.log('Incoming request query:', req.query);
  const { month, day } = req.query;
  if (!month || !day) {
    console.error('Missing month or day parameter');
    res.status(400).json({ error: 'Missing month or day parameter' });
    return;
  }

  const monthNum = parseInt(month as string, 10);
  const dayNum = parseInt(day as string, 10);
  console.log(`Parsed query values: month=${monthNum}, day=${dayNum}`);

  try {
    const response = await fetchWithRetry(`https://external.api/date?month=${monthNum}&day=${dayNum}`);
    console.log('External API response status:', response.status);
    if (!response.ok) {
      console.error('External API returned error with status:', response.status);
      res.status(response.status).json({ error: 'Failed to fetch events' });
      return;
    }
    const data = await response.json();
    console.log('External API data:', data);
    const eventsList: HistoryEvent[] = Array.isArray(data) ? data : data.events;
    console.log('Returning events list:', eventsList);
    res.status(200).json({ events: eventsList });
  } catch (error) {
    console.error('Error caught in API route:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: String(error) });
    }
  }
};
