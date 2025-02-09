import { useState, useEffect, useCallback } from 'react';

interface HistoryEvent {
  year: number;
  content: string;
}

const useHistory = () => {
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const fetchHistoryEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/date?month=${month}&day=${day}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        // Handle 404 gracefully - no events for this date
        setEvents([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data.events)) {
        setEvents([]);
        return;
      }

      setEvents(
        data.events.map((event: { year: number; content: string }) => ({
          year: event.year,
          content: event.content,
        })),
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [month, day]);

  useEffect(() => {
    fetchHistoryEvents();
  }, [fetchHistoryEvents]);

  return { events, loading, error, refetch: fetchHistoryEvents };
};

export default useHistory;
