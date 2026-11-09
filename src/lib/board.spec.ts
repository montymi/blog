import { expect, test } from 'vitest';

import { posts, projects } from '@/content';
import { SNAPSHOTS } from '@/platform/registry';

import { SIZE, board, knightsTour, squareName } from './board';

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
