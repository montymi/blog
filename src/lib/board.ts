/**
 * The site's index on sixty-four squares: everything made, oldest at a1, reading along each rank
 * like a board's notation, newest toward h8. Sixty-four is the limit by design: when the board
 * is full, something has to leave it.
 */
import type { Post, Project } from '@/content';
import type { Manifest } from '@/platform/contract';

export type Piece = 'app' | 'project' | 'post';

export interface Square {
  /** Board notation: a1 ... h8. */
  name: string;
  item: { kind: Piece; title: string; href: string; away?: boolean; when: string } | null;
}

/** What a piece is across the site's lists (a theme's entries use the same kinds and titles). */
export const pieceKey = (item: { kind: string; title: string }) => `${item.kind}:${item.title}`;

const FILES = 'abcdefgh';
export const SIZE = 64;

/** The square for the nth item, filling rank 1 left to right, then rank 2... */
export const squareName = (n: number) => `${FILES[n % 8]}${Math.floor(n / 8) + 1}`;

const dated = (iso: string) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso : null);

export function board(projects: Project[], posts: Post[], apps: Manifest[]): Square[] {
  const items = [
    ...projects.map((p) => ({
      kind: 'project' as const,
      title: p.title,
      href: `/projects/${p.slug}`,
      when: dated(p.released) ?? p.updated,
    })),
    ...posts.map((p) => ({
      kind: 'post' as const,
      title: p.title,
      href: `/writing/${p.slug}`,
      when: p.date,
    })),
  ].sort((a, b) => a.when.localeCompare(b.when) || a.title.localeCompare(b.title));
  // The apps are what's running now: they take the newest squares.
  const all = [
    ...items,
    ...apps.map((app) => ({
      kind: 'app' as const,
      title: app.name,
      href: app.url,
      away: true,
      when: 'now',
    })),
  ].slice(0, SIZE);
  return Array.from({ length: SIZE }, (_, n) => ({ name: squareName(n), item: all[n] ?? null }));
}

const KNIGHT = [
  [1, 2],
  [2, 1],
  [2, -1],
  [1, -2],
  [-1, -2],
  [-2, -1],
  [-2, 1],
  [-1, 2],
];

/**
 * A knight's tour: all sixty-four squares, each visited once, every step a knight's move. Found
 * by Warnsdorff's rule (go where the fewest onward moves remain), ties broken by move order, so
 * the same start always gives the same tour. Square n is file n % 8, rank n / 8, as squareName.
 */
export function knightsTour(start = 0): number[] {
  const seen = new Set([start]);
  const tour = [start];
  const onward = (n: number) =>
    KNIGHT.map(([df, dr]) => [(n % 8) + df, Math.floor(n / 8) + dr])
      .filter(([f, r]) => f >= 0 && f < 8 && r >= 0 && r < 8)
      .map(([f, r]) => r * 8 + f)
      .filter((m) => !seen.has(m));
  while (tour.length < SIZE) {
    const next = onward(tour[tour.length - 1]).sort(
      (a, b) => onward(a).length - onward(b).length,
    )[0];
    if (next === undefined) break;
    seen.add(next);
    tour.push(next);
  }
  return tour;
}
