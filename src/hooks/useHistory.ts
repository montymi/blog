import { useState, useEffect, useCallback } from 'react';

interface HistoryEvent {
  year: number;
  content: string;
}

const useHistory = (): { events: HistoryEvent[]; loading: boolean; refetch: () => void } => {
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const fetchHistoryEvents = useCallback(async () => {
    try {
      const fetchWithRetry = async (
        url: string,
        retries: number = 3,
        delay: number = 1000,
      ): Promise<Response> => {
        for (let i = 0; i < retries; i++) {
          try {
            // Use relative URL to leverage Vite's proxy
            const response = await fetch(`/api/date?month=${month}&day=${day}`, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              return response;
            }

            if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
              const resetTime = response.headers.get('X-RateLimit-Reset');
              const waitTime = resetTime ? parseInt(resetTime) * 1000 - Date.now() : delay;
              await new Promise<void>((resolve) => setTimeout(resolve, waitTime));
              continue;
            }

            throw new Error(`HTTP error! status: ${response.status}`);
          } catch (err) {
            if (i === retries - 1) throw err;
            await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i))); // Exponential backoff
          }
        }
        throw new Error('Maximum retries reached');
      };

      const response = await fetchWithRetry('/api/date');
      const data = await response.json();

      if (!data?.events) {
        throw new Error('Invalid response format');
      }

      const formattedEvents = data.events.map((event: HistoryEvent) => ({
        year: event.year,
        content: event.content,
      }));

      setEvents(formattedEvents);
    } catch (error: unknown) {
      console.error(
        'Error fetching latest events:',
        error instanceof Error ? error.message : 'Unknown error',
      );
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
