/**
 * The front door's command line. A sentence whose first word an app owns is that app's to read
 * (see platform/contract.ts); anything else searches what the site holds.
 */
import { route, type Manifest } from '@/platform/contract';
import {
  findGraphNode,
  graphHref,
  checkGraphQuery,
  graphResultIds,
  graphResultDetail,
  graphResultKind,
  type GraphQuery,
} from '@/lib/graph-query';
import { graphNode } from '@/content/graph';

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
  | {
      type: 'graph';
      query: string;
      interpretation: GraphQuery;
      href: string;
      results: Destination[];
      canonical: string;
    }
  | { type: 'query-help'; message: string; suggestions: string[] }
  | { type: 'results'; results: Destination[] }
  | { type: 'empty' };

export function answer(text: string, index: Searchable[], apps: Manifest[]): Answer {
  const query = text.trim();
  if (!query) return { type: 'empty' };
  const app = route(query, apps);
  if (app) return { type: 'ask', app, query };
  const checked = checkGraphQuery(text);
  if (checked.kind === 'help')
    return { type: 'query-help', message: checked.message, suggestions: checked.suggestions };
  if (checked.kind === 'valid') {
    const interpretation = checked.plan;
    const results = graphResultIds(interpretation).map((id) => {
      const node = graphNode(id)!;
      return {
        label: node.title,
        kind: graphResultKind(node),
        href: node.href,
        away: node.away,
        detail: graphResultDetail(interpretation, id),
      };
    });
    return {
      type: 'graph',
      query,
      interpretation,
      href: graphHref(query),
      results,
      canonical: checked.canonical,
    };
  }
  const opening = /^(?:open|take me to|go to) (.+)$/i.exec(query);
  const node = opening ? findGraphNode(opening[1]) : undefined;
  if (node)
    return {
      type: 'results',
      results: [
        {
          label: node.title,
          kind: node.kind === 'paper' ? 'PDF' : node.kind === 'post' ? 'Post' : 'Project',
          href: node.href,
          away: node.away,
          detail: node.about,
        },
      ],
    };
  return { type: 'results', results: search(query, index) };
}

/** A few sentences to try: each app's first example, then a search. */
export function examples(apps: Manifest[]): string[] {
  return [
    ...apps.flatMap((app) => app.language?.examples.slice(0, 1) ?? []),
    'capstone',
    'show foundations',
    'what uses authkit',
    'show projects where status = published',
  ];
}
