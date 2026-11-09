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
