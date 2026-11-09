/**
 * The front door's command line. A sentence whose first word an app owns is that app's to read
 * (see platform/contract.ts); anything else searches what the site holds.
 */
import { route, type Manifest } from '@/platform/contract';

export interface Destination {
  label: string;
  /** What it is, for the line under the label: "Post", "Project", "PDF", "App". */
  kind: string;
  href: string;
  /** True when it leaves this site. */
  away?: boolean;
  detail?: string;
}

export interface Searchable extends Destination {
  /** Extra words to match on: summary, description, tags. */
  text: string;
}

/** Every word typed must appear; titles that start with the words rank first. */
export function search(text: string, index: Searchable[], limit = 6): Destination[] {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return index
    .map((item) => {
      const title = item.label.toLowerCase();
      const all = `${title} ${item.text.toLowerCase()} ${item.kind.toLowerCase()}`;
      if (!words.every((word) => all.includes(word))) return null;
      const score =
        (title.startsWith(words[0]) ? 4 : 0) +
        words.filter((word) => title.includes(word)).length * 2;
      return { item, score };
    })
    .filter((hit): hit is { item: Searchable; score: number } => hit !== null)
    .sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label))
    .slice(0, limit)
    .map(({ item: { text: _text, ...destination } }) => destination);
}

export type Answer =
  | { type: 'ask'; app: Manifest; query: string }
  | { type: 'results'; results: Destination[] }
  | { type: 'empty' };

export function answer(text: string, index: Searchable[], apps: Manifest[]): Answer {
  const query = text.trim();
  if (!query) return { type: 'empty' };
  const app = route(query, apps);
  return app ? { type: 'ask', app, query } : { type: 'results', results: search(query, index) };
}

/** A few sentences to try: each app's first example, then a search. */
export function examples(apps: Manifest[]): string[] {
  return [...apps.flatMap((app) => app.language?.examples.slice(0, 1) ?? []), 'capstone'];
}
