import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { posts, projects } from '@/content';
import { board, knightsTour, squareName, type Piece, type Square } from '@/lib/board';
import { formatDate } from '@/lib/dates';
import { SNAPSHOTS } from '@/platform/registry';

const KIND: Record<Piece, string> = {
  app: 'App, running now',
  project: 'Project',
  post: 'Writing',
};

/** Each kind marked by form, not colour alone: a solid pitch square, an ink block, a red-pen line. */
function Mark({ kind }: { kind: Piece }) {
  if (kind === 'app') return <span className="absolute inset-[22%] rounded-sm bg-accent" />;
  if (kind === 'project')
    return (
      <span className="absolute inset-[26%] rounded-sm border border-ink/80 bg-raised shadow-[3px_3px_0_0_rgb(var(--c-ink)/0.75)]" />
    );
  return (
    <span className="absolute inset-x-[22%] top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-bad" />
  );
}

const STEP = 110;

/**
 * On a touch screen there is no cursor to leave a trail, so the board plays one: a knight's tour
 * across all sixty-four squares in fall brown, once each time the board comes into view. Not for
 * people who ask for reduced motion, and never while the board is out of sight.
 */
function useKnightsTour(
  grid: React.RefObject<HTMLDivElement>,
  setLit: (name: string | null) => void,
) {
  useEffect(() => {
    const node = grid.current;
    const touch = window.matchMedia?.('(hover: none)').matches;
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!node || !touch || still || typeof IntersectionObserver === 'undefined') return;
    const tour = knightsTour();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const stop = () => {
      clearTimeout(timer);
      timer = undefined;
      setLit(null);
    };
    const play = (step = 0) => {
      if (step >= tour.length) return stop();
      setLit(squareName(tour[step]));
      timer = setTimeout(() => play(step + 1), STEP);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && timer === undefined) play();
        if (!entry.isIntersecting) stop();
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      stop();
    };
  }, [grid, setLit]);
}

/**
 * Everything made, on sixty-four squares: oldest at a1, newest toward h8, the running apps last.
 * Point at a square to read it; empty squares are room for what comes next.
 */
export function Board() {
  const squares = useMemo(() => board(projects, posts, SNAPSHOTS), []);
  const [shown, setShown] = useState<Square | null>(null);
  // The square lit fall brown by the knight's tour or a tap (where there is no hover to do it).
  const [lit, setLit] = useState<string | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  useKnightsTour(grid, setLit);
  const tapped = useRef<ReturnType<typeof setTimeout>>();
  function tap(name: string) {
    clearTimeout(tapped.current);
    setLit(name);
    tapped.current = setTimeout(() => setLit((now) => (now === name ? null : now)), 160);
  }
  const used = squares.filter((s) => s.item).length;
  // Drawn rank 8 at the top, like a board seen from White's side.
  const ranks = Array.from({ length: 8 }, (_, r) => squares.slice((7 - r) * 8, (8 - r) * 8));

  return (
    <figure className="flex w-full max-w-[16rem] flex-col gap-2 md:w-56">
      <div
        ref={grid}
        className="grid aspect-square grid-cols-8 grid-rows-8 overflow-hidden rounded-sm border border-ink/80"
        role="list"
        aria-label={`Everything made, on a board: ${used} of 64 squares`}
      >
        {ranks.flat().map((square, i) => {
          const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;
          const shade = lit === square.name ? 'bg-fall' : dark ? 'bg-inset' : 'bg-raised';
          // Fall brown under the cursor, on at once and fading slowly: a trail across the board.
          // A lit square (the tour, a tap) snaps on the same way.
          const fall = `hover:bg-fall motion-safe:transition-colors ${
            lit === square.name
              ? 'motion-safe:duration-75'
              : 'motion-safe:duration-700 motion-safe:hover:duration-75'
          }`;
          const label = square.item
            ? `${square.name}: ${square.item.title}, ${KIND[square.item.kind].toLowerCase()}`
            : '';
          const inside = square.item && <Mark kind={square.item.kind} />;
          const props = {
            className: `focus-ring relative block ${shade} ${fall} focus-visible:z-10`,
            'aria-label': label,
            onMouseEnter: () => setShown(square),
            onMouseLeave: () => setShown(null),
            onFocus: () => setShown(square),
            onBlur: () => setShown(null),
          };
          return (
            <span
              key={square.name}
              role="listitem"
              onPointerDown={() => tap(square.name)}
              className={square.item ? '' : `${shade} ${fall}`}
            >
              {!square.item ? null : square.item.away ? (
                <a href={square.item.href} {...props} style={{ height: '100%' }}>
                  {inside}
                </a>
              ) : (
                <Link to={square.item.href} {...props} style={{ height: '100%' }}>
                  {inside}
                </Link>
              )}
            </span>
          );
        })}
      </div>
      <figcaption aria-live="polite" className="min-h-10 font-mono text-xs leading-5 text-muted">
        {shown?.item ? (
          <>
            <span className="text-ink">{shown.name}</span> {shown.item.title}
            <br />
            {KIND[shown.item.kind]}
            {shown.item.when !== 'now' && `, ${formatDate(shown.item.when)}`}
          </>
        ) : (
          <>
            {used} of 64 squares, oldest at a1.
            <br />
            Apps <span className="text-accent">■</span> projects <span className="text-ink">□</span>{' '}
            writing <span className="text-bad">—</span>
          </>
        )}
      </figcaption>
    </figure>
  );
}
