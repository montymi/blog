import { useState, useEffect } from 'react';
import { fetchHistoryEvents, HistoryEvent } from '../../api/day-in-history';

export const useHistoryEvents = (month: number, day: number) => {
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchHistoryEvents(month, day);
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, day]);

  return { events, loading, error };
};
