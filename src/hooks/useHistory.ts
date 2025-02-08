import { useState, useEffect } from 'react';

export const useHistoryEvents = (month: number, day: number) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/day-in-history');
        const data = await response.json();
        console.log(data.message); // "Hello, world!"
        setEvents(data);
      } catch (error) {
        console.error(error);
        setError(error instanceof Error ? error.message : 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, day]);

  return { events, loading, error };
};