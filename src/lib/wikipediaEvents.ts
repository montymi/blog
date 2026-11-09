export interface WikipediaOnThisDayEvent {
  text: string;
  year: number;
}

export interface HistoryEvent {
  year: number;
  content: string;
}

/** Maps Wikimedia's "on this day" event shape into this app's `{ year, content }` contract. */
export function mapWikipediaEvents(data: { events?: WikipediaOnThisDayEvent[] }): HistoryEvent[] {
  return (data.events ?? []).map(({ year, text }) => ({ year, content: text }));
}
