import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { posts, projects } from '@/content';
import { themes, type Entry, type Kind } from '@/content/themes';
import { board, pieceKey } from '@/lib/board';
import { SNAPSHOTS } from '@/platform/registry';

import { Board } from './Board';

const KIND_WORD: Record<Kind, string> = {
  app: 'App',
  project: 'Project',
  paper: 'Paper',
  post: 'Writing',
};

/** The same marks as the board, by form not colour alone. */
function Glyph({ kind }: { kind: Kind }) {
  const shape: Record<Kind, string> = {
    app: 'h-2.5 w-2.5 rounded-sm bg-accent',
    project: 'h-2.5 w-2.5 rounded-sm border-2 border-ink bg-raised',
    paper: 'h-3 w-2.5 rounded-[1px] border border-ink/70 bg-raised',
    post: 'h-[3px] w-3 rounded-full bg-bad',
  };
  return (
    <span aria-hidden="true" className="flex h-4 w-4 shrink-0 items-center justify-center">
      <span className={shape[kind]} />
    </span>
  );
}

// Everything, newest first: the board's squares read backwards.
const SQUARES = board(projects, posts, SNAPSHOTS).flatMap((s) => (s.item ? [s.item] : []));
const RECENT: Entry[] = [...SQUARES]
  .reverse()
  .map(({ kind, title, href, away }) => ({ kind, title, href, away: Boolean(away) }));
const order = new Map(SQUARES.map((item, i) => [pieceKey(item), i]));
/** A theme's entries, newest first; papers aren't on the board, so they come last. */
const newestFirst = (entries: Entry[]) =>
  [...entries].sort((a, b) => (order.get(pieceKey(b)) ?? -1) - (order.get(pieceKey(a)) ?? -1));

const SHOWN = 6;

function Row({ entry }: { entry: Entry }) {
  const className =
    'focus-ring group flex min-h-11 items-center justify-between gap-4 border-b border-line py-2';
  const inside = (
    <>
      <span className="font-semibold group-hover:text-accent">{entry.title}</span>
      <span className="kicker">
        {entry.away && entry.kind === 'post' ? 'Substack' : KIND_WORD[entry.kind]}
      </span>
    </>
  );
  return (
    <li>
      {entry.away ? (
        <a href={entry.href} className={className}>
          {inside}
        </a>
      ) : (
        <Link to={entry.href} className={className}>
          {inside}
        </Link>
      )}
    </li>
  );
}

/**
 * The board beside its index: pick a theme and the board keeps only its squares lit, and the
 * list below shows what's in it. With no theme, the newest few.
 */
export function Shelf({ more }: { more?: ReactNode }) {
  const [picked, setPicked] = useState<string | null>(null);
  const theme = themes.find((t) => t.id === picked) ?? null;
  const focus = useMemo(() => (theme ? new Set(theme.entries.map(pieceKey)) : null), [theme]);
  const entries = theme ? newestFirst(theme.entries) : RECENT.slice(0, SHOWN);
  const chip = (on: boolean) =>
    `focus-ring min-h-9 rounded-sm border px-3 text-xs font-semibold ${
      on ? 'border-ink bg-ink text-surface' : 'border-line-strong text-ink hover:border-ink'
    }`;

  return (
    <div className="grid gap-10 md:grid-cols-[20rem_1fr] md:items-start">
      <Board focus={focus} />
      <div className="flex min-w-0 flex-col gap-4">
        <p className="kicker">The board</p>
        <h2 className="font-display text-[1.75rem] font-medium leading-[2.125rem]">
          Everything, one square each.
        </h2>
        <ul aria-label="Key" className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {(Object.keys(KIND_WORD) as Kind[]).map((kind) => (
            <li key={kind} className="flex items-center gap-1">
              <Glyph kind={kind} />
              {KIND_WORD[kind]}
            </li>
          ))}
        </ul>
        <div role="group" aria-label="Themes" className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={!theme}
            onClick={() => setPicked(null)}
            className={chip(!theme)}
          >
            Everything
          </button>
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={picked === t.id}
              onClick={() => setPicked(picked === t.id ? null : t.id)}
              className={chip(picked === t.id)}
            >
              {t.name}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="border-t border-line pt-4 text-xs text-muted">
          {theme ? theme.about : 'Pick a theme, or open a square. Most recent first below.'}
        </p>
        <ul aria-label={theme?.name ?? 'Most recent'} className="flex flex-col">
          {entries.map((entry) => (
            <Row key={entry.href} entry={entry} />
          ))}
        </ul>
        {more && <div className="flex gap-4 pt-2 text-sm">{more}</div>}
      </div>
    </div>
  );
}
