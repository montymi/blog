import { expect, test } from 'vitest';

import { papers, posts, projects, reports } from '@/content';

import { SIZE, board, knightsTour, squareName } from './board';

test('squares are named like a chessboard, filling rank 1 first', () => {
  expect([0, 7, 8, 63].map(squareName)).toEqual(['a1', 'h1', 'a2', 'h8']);
});

test('every project, paper, and post has one square, in date order', () => {
  const squares = board(projects, posts, papers);
  expect(squares).toHaveLength(SIZE);
  const filled = squares.filter((s) => s.item);
  expect(filled).toHaveLength(projects.length + posts.length + reports.length);
  const when = filled.map((s) => s.item!.when);
  expect(when).toEqual([...when].sort());
  expect(new Set(filled.map((s) => s.item!.href)).size).toBe(filled.length);
});

test('the knight tours every square once, by knight moves', () => {
  const tour = knightsTour();
  expect(tour).toHaveLength(SIZE);
  expect(new Set(tour).size).toBe(SIZE);
  for (let i = 1; i < tour.length; i++) {
    const df = Math.abs((tour[i] % 8) - (tour[i - 1] % 8));
    const dr = Math.abs(Math.floor(tour[i] / 8) - Math.floor(tour[i - 1] / 8));
    expect([df, dr].sort().join()).toBe('1,2');
  }
});

test('reports have PDF squares; supporting documents and the résumé have their own homes', () => {
  const items = board(projects, posts, papers).flatMap((s) => (s.item ? [s.item] : []));
  for (const { file: href } of reports) {
    expect(items).toContainEqual(expect.objectContaining({ kind: 'paper', href, away: true }));
  }
  for (const paper of papers.filter((p) => p.kind !== 'report')) {
    expect(items.some((item) => item.href === paper.file)).toBe(false);
  }
});

test('a released project turns green without becoming a second item', () => {
  const charon = projects.find((p) => p.slug === 'charon')!;
  for (const status of ['draft', 'published'] as const) {
    const items = board([{ ...charon, status }], [], []).flatMap((s) => (s.item ? [s.item] : []));
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      kind: 'project',
      href: '/projects/charon',
      released: status === 'published',
    });
  }
});

test('external writing squares point to the original publication', () => {
  const post = posts.find((p) => p.slug === 'blitzys-blitz-adventures-in-chess')!;
  const item = board([], [post], [])[0].item;
  expect(item).toMatchObject({ href: post.url, away: true });
});
