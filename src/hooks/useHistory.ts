import { useState, useEffect, useCallback } from 'react';

interface HistoryEvent {
  year: number;
  content: string;
}

/**
 * Custom hook to fetch the latest commit from any GitHub repository of a user.
 *
 * @param {string} username - The GitHub username.
 * @returns {Object} - An object containing the latest commit, loading state, and a refetch function.
 */
const useHistory = (): { events: HistoryEvent[]; loading: boolean; refetch: () => void } => {
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  interface FetchOptions {
    headers: {
      Accept: string;
      'Content-Type': string;
    };
  }

  const fetchHistoryEvents = useCallback(async () => {
    try {
      const fetchWithRetry = async (
        url: string,
        retries: number = 3,
        delay: number = 1000,
      ): Promise<Response> => {
        for (let i = 0; i < retries; i++) {
          const response = await fetch(url, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          } as FetchOptions);
          if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
            const resetTime = response.headers.get('X-RateLimit-Reset');
            const waitTime = resetTime ? parseInt(resetTime) * 1000 - Date.now() : delay;
            await new Promise<void>((resolve) => setTimeout(resolve, waitTime));
          } else {
            return response;
          }
        }
        throw new Error('Rate limit exceeded');
      };

      const response = await fetchWithRetry(`/api/date?month=${month}&day=${day}`);
      const data = await response.json();

      const eventPromises: Promise<HistoryEvent>[] = data?.events.map(
        async (event: HistoryEvent) => {
          return {
            year: event.year,
            content: event.content,
          } as HistoryEvent;
        },
      );
      const events = await Promise.all(eventPromises);
      setEvents(events);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching latest events:', error.message);
      } else {
        console.error('An unknown error occurred while fetching latest events');
      }
    } finally {
      setLoading(false);
    }
  }, [month, day]);

  useEffect(() => {
    fetchHistoryEvents();
  }, [fetchHistoryEvents]);

  return { events, loading, refetch: fetchHistoryEvents };
};

export default useHistory;
