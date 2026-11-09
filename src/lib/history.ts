export interface HistoryEvent {
  year: number;
  content: string;
}

/** Validate and shape the `/api/date` response into a safe list of events. */
export function normalizeHistoryEvents(data: unknown): HistoryEvent[] {
  const events = (data as { events?: unknown } | null)?.events;
  if (!Array.isArray(events)) return [];

  return events.map((event: { year: number; content: string }) => ({
    year: event.year,
    content: event.content,
  }));
}
