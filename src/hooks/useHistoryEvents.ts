import { useState, useEffect } from 'react';

interface HistoryEvent {
  year: number;
  content: string;
}

const useHistoryEvents = (month: number, day: number) => {
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWithRetry = async (
      url: string,
      retries: number = 3,
      delay: number = 1000,
    ): Promise<Response> => {
      for (let i = 0; i < retries; i++) {
        const response = await fetch(url, { mode: 'cors' }); // Add mode: 'cors' here
        if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
          const resetTime = response.headers.get('X-RateLimit-Reset');
          const waitTime = resetTime ? parseInt(resetTime) * 1000 - Date.now() : delay;
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        } else {
          return response;
        }
      }
      throw new Error('Rate limit exceeded');
    };

    const fetchEvents = async () => {
      try {
        const response = await fetchWithRetry(`/api/date?month=${month}&day=${day}`);
        const data = await response.json();
        // Convert fetched data to only show the list of events
        const eventsList: HistoryEvent[] = Array.isArray(data) ? data : data.events;
        setEvents(eventsList);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [month, day]);

  return { events, loading, error };
};

export default useHistoryEvents;
