import { Link } from 'react-router-dom';

import { themes, type Entry, type Kind } from '@/content/themes';

const KIND_WORD: Record<Kind, string> = {
  app: 'App',
  project: 'Project',
  paper: 'PDF',
  post: 'Writing',
};

/** The same marks as the board, by form not colour alone: what kind of thing each item is. */
function Glyph({ kind }: { kind: Kind }) {
  const shape: Record<Kind, string> = {
    app: 'h-2.5 w-2.5 rounded-sm bg-accent',
    project:
      'h-2.5 w-2.5 rounded-sm border border-ink/80 bg-raised shadow-[2px_2px_0_0_rgb(var(--c-ink)/0.75)]',
    paper: 'h-3 w-2.5 rounded-[1px] border border-ink/70 bg-raised',
    post: 'h-[3px] w-3 rounded-full bg-bad',
  };
  return (
    <span aria-hidden="true" className="flex h-4 w-4 shrink-0 items-center justify-center">
      <span className={shape[kind]} />
    </span>
  );
}

function Item({ entry }: { entry: Entry }) {
  const inside = (
    <>
      <Glyph kind={entry.kind} />
      <span className="font-semibold group-hover:text-accent">{entry.title}</span>
      <span className="font-mono text-xs text-muted">
        {entry.away && entry.kind === 'post' ? 'On Substack' : KIND_WORD[entry.kind]}
      </span>
    </>
  );
  const className =
    'focus-ring group flex min-h-11 items-baseline gap-2 py-1.5 [&>span:first-child]:self-center';
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

/** Everything made, grouped by what it's about rather than what kind of thing it is. */
export function Themes() {
  return (
    <ul className="flex flex-col border-t border-ink/80">
      {themes.map((theme) => (
        <li
          key={theme.id}
          className="grid gap-x-8 gap-y-2 border-b border-line py-5 sm:grid-cols-[14rem_1fr]"
        >
          <div className="flex flex-col gap-1">
            <h3 className="font-display text-[1.3125rem] font-medium leading-7">{theme.name}</h3>
            <p className="text-sm text-muted">{theme.about}</p>
          </div>
          <ul aria-label={theme.name} className="flex flex-col">
            {theme.entries.map((entry) => (
              <Item key={entry.href} entry={entry} />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
