import { expect, test } from 'vitest';

import { posts, projects } from '@/content';
import { SNAPSHOTS } from '@/platform/registry';

import { SIZE, board, squareName } from './board';

test('squares are named like a chessboard, filling rank 1 first', () => {
  expect([0, 7, 8, 63].map(squareName)).toEqual(['a1', 'h1', 'a2', 'h8']);
});

test('everything is on the board, oldest first, the running apps last', () => {
  const squares = board(projects, posts, SNAPSHOTS);
  expect(squares).toHaveLength(SIZE);
  const filled = squares.filter((s) => s.item);
  expect(filled).toHaveLength(projects.length + posts.length + SNAPSHOTS.length);
  const when = filled.filter((s) => s.item!.kind !== 'app').map((s) => s.item!.when);
  expect(when).toEqual([...when].sort());
  expect(filled.at(-1)!.item!.kind).toBe('app');
});
