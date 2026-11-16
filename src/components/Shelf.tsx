import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { papers, posts, projects, projectBySlug, reports } from '@/content';
import { themes, type Entry, type Kind } from '@/content/themes';
import { board, pieceKey } from '@/lib/board';
import { publicationName } from '@/lib/publication';

import { Board } from './Board';
import { ProjectDetails } from './ProjectDetails';

const KIND_WORD: Record<Kind, string> = {
  project: 'Project',
  paper: 'Report',
  post: 'Writing',
};

/** The same marks as the board, by form not colour alone. */
function Glyph({ kind, released }: { kind: Kind; released?: boolean }) {
  const shape: Record<Kind, string> = {
    project: 'h-2.5 w-2.5 rounded-sm border-2 border-ink bg-raised',
    paper: 'h-3 w-2.5 rounded-[1px] border border-ink/70 bg-raised',
    post: 'h-[3px] w-3 rounded-full bg-bad',
  };
  return (
    <span aria-hidden="true" className="flex h-4 w-4 shrink-0 items-center justify-center">
      <span className={released ? 'h-2.5 w-2.5 rounded-sm bg-accent' : shape[kind]} />
    </span>
  );
}

// Everything, newest first: the board's squares read backwards.
const SQUARES = board(projects, posts, papers).flatMap((s) => (s.item ? [s.item] : []));
const RECENT: Entry[] = [...SQUARES].reverse().map(({ kind, title, href, away, released }) => ({
  kind,
  title,
  href,
  away: Boolean(away),
  released,
}));
const order = new Map(SQUARES.map((item, i) => [pieceKey(item), i]));
/** A theme’s entries, newest first; undated entries follow the board’s pieces. */
const newestFirst = (entries: Entry[]) =>
  [...entries].sort((a, b) => (order.get(pieceKey(b)) ?? -1) - (order.get(pieceKey(a)) ?? -1));

const SHOWN = 6;

function Row({
  entry,
  onSelectProject,
}: {
  entry: Entry;
  onSelectProject: (href: string) => void;
}) {
  const className =
    'focus-ring group flex min-h-11 items-center justify-between gap-4 border-b border-line py-2';
  const inside = (
    <>
      <span className="font-semibold group-hover:text-accent">{entry.title}</span>
      <span className="kicker">
        {entry.away && entry.kind === 'post'
          ? publicationName(entry.href)
          : entry.released
            ? 'Released project'
            : KIND_WORD[entry.kind]}
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
        <Link
          to={entry.href}
          className={className}
          onClick={(event) => {
            if (
              entry.kind === 'project' &&
              !event.metaKey &&
              !event.ctrlKey &&
              !event.shiftKey &&
              !event.altKey &&
              event.button === 0
            ) {
              event.preventDefault();
              onSelectProject(entry.href);
            }
          }}
        >
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
export function Shelf() {
  const [picked, setPicked] = useState<string | null>(null);
  const [view, setView] = useState<'recent' | 'projects' | 'writing'>('recent');
  const [selected, setSelected] = useState<string | null>(null);
  const details = useRef<HTMLDivElement>(null);
  const project = selected ? projectBySlug(selected.replace('/projects/', '')) : null;
  const theme = themes.find((t) => t.id === picked) ?? null;
  const entries = theme
    ? newestFirst(theme.entries)
    : view === 'projects'
      ? RECENT.filter((entry) => entry.kind === 'project')
      : view === 'writing'
        ? RECENT.filter((entry) => entry.kind === 'paper' || entry.kind === 'post')
        : RECENT.slice(0, SHOWN);
  const focus = theme || view !== 'recent' ? new Set(entries.map(pieceKey)) : null;
  useEffect(() => {
    if (project) details.current?.focus();
  }, [project]);
  function browse(next: typeof view, themeId: string | null = null) {
    setSelected(null);
    setView(next);
    setPicked(themeId);
  }
  const chip = (on: boolean) =>
    `focus-ring min-h-9 rounded-sm border px-3 text-xs font-semibold ${
      on ? 'border-ink bg-ink text-surface' : 'border-line-strong text-ink hover:border-ink'
    }`;

  return (
    <div className="grid gap-10 md:grid-cols-[20rem_1fr] md:items-start">
      <Board focus={focus} selectedHref={selected ?? undefined} onSelectProject={setSelected} />
      <div className="flex min-w-0 flex-col gap-4">
        <p className="kicker">The board</p>
        <h2 className="font-display text-[1.75rem] font-medium leading-[2.125rem]">
          Everything, one square each.
        </h2>
        <ul aria-label="Key" className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {(
            [
              { kind: 'project', label: 'Released project', released: true },
              { kind: 'project', label: 'Project', released: false },
              { kind: 'paper', label: 'Report', released: false },
              { kind: 'post', label: 'Writing', released: false },
            ] as const
          ).map(({ kind, label, released }) => (
            <li key={label} className="flex items-center gap-1">
              <Glyph kind={kind} released={released} />
              {label}
            </li>
          ))}
        </ul>
        <div role="group" aria-label="Themes" className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={!theme && view === 'recent'}
            onClick={() => browse('recent')}
            className={chip(!theme && view === 'recent')}
          >
            Everything
          </button>
          <button
            type="button"
            aria-pressed={view === 'projects'}
            onClick={() => browse('projects')}
            className={chip(view === 'projects')}
          >
            Projects ({projects.length})
          </button>
          <button
            type="button"
            aria-pressed={view === 'writing'}
            onClick={() => browse('writing')}
            className={chip(view === 'writing')}
          >
            Writing ({posts.length + reports.length})
          </button>
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={picked === t.id}
              onClick={() => browse('recent', picked === t.id ? null : t.id)}
              className={chip(picked === t.id)}
            >
              {t.name}
            </button>
          ))}
        </div>
        {project ? (
          <div
            ref={details}
            tabIndex={-1}
            role="region"
            aria-label={`${project.title} project details`}
            className="flex min-w-0 flex-col gap-5 border-t border-line pt-4"
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="link self-start text-sm"
            >
              Back to board index
            </button>
            <ProjectDetails key={project.slug} project={project} embedded />
          </div>
        ) : (
          <>
            <p aria-live="polite" className="border-t border-line pt-4 text-xs text-muted">
              {theme
                ? theme.about
                : view === 'projects'
                  ? 'All projects, one square each. Released projects are green.'
                  : view === 'writing'
                    ? 'Posts and research reports, together. Reports open as PDFs.'
                    : 'Pick a theme, or open a square. Most recent first below.'}
            </p>
            <ul
              aria-label={
                theme?.name ??
                (view === 'projects' ? 'Projects' : view === 'writing' ? 'Writing' : 'Most recent')
              }
              className="flex flex-col"
            >
              {entries.map((entry) => (
                <Row key={entry.href} entry={entry} onSelectProject={setSelected} />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
