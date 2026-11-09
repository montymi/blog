import { mapWikipediaEvents } from './wikipediaEvents';

export interface HistoryApiResult {
  status: number;
  body: unknown;
}

/**
 * The actual request-handling logic behind `/api/date`, shared between the
 * real Vercel function (`_api/date.ts`, used in production) and the Vite
 * dev-server middleware (`vite.config.ts`, used under `npm run dev`) — Vite
 * never runs Vercel functions itself, so without this the endpoint only
 * ever worked in production and silently fell through to the SPA shell
 * locally.
 */
export async function fetchHistoryEvents(month: string, day: string): Promise<HistoryApiResult> {
  if (!month || !day) {
    return { status: 400, body: { error: 'Missing month or day parameters' } };
  }

  const API_URL = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;

  try {
    const response = await fetch(API_URL, {
      headers: {
        Accept: 'application/json',
        // Wikimedia's API etiquette policy asks for an identifying User-Agent.
        'User-Agent': 'montymi-blog (https://montymi.com)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return { status: 200, body: { events: mapWikipediaEvents(data) } };
  } catch (_error) {
    return { status: 500, body: { error: 'Failed to fetch history events' } };
  }
}
