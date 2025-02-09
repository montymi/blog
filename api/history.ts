import { useState, useEffect } from 'react';

interface HistoryEvent {
  year: number;
  content: string;
}

const API_URL = 'https://events.historylabs.io';

export const useHistoryEvents = (month: number, day: number) => {
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/date?month=${month}&day=${day}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching history events:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, day]);

  return { events, loading, error };
};

export default useHistoryEvents;