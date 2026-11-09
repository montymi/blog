import { expect, test } from 'vitest';

import { SNAPSHOTS } from '@/platform/registry';

import { answer, examples, search, type Searchable } from './command';

const index: Searchable[] = [
  {
    label: 'Capstone',
    kind: 'Project',
    href: '/projects/capstone',
    text: 'solar charging station',
  },
  { label: 'Capstone Software Presentation', kind: 'PDF', href: '/library/c.pdf', text: '' },
  {
    label: 'Window Shopping',
    kind: 'Post',
    href: '/writing/window-shopping',
    text: 'vignette fiction',
  },
];

test("a sentence an app owns is that app's to read, as typed", () => {
  expect(answer('  plan 4 dinners for 2 under $40', index, SNAPSHOTS)).toMatchObject({
    type: 'ask',
    app: { id: 'chef' },
    query: 'plan 4 dinners for 2 under $40',
  });
  expect(answer('mistakes by phase', index, SNAPSHOTS)).toMatchObject({ app: { id: 'chess' } });
});

test('each app offers an example to try', () => {
  expect(examples(SNAPSHOTS)).toEqual([
    'plan 4 dinners for 2 under $40',
    'mistakes where theme = fork by month',
    'capstone',
  ]);
});

test('anything else searches, every word must match, titles first', () => {
  expect(search('capstone', index).map((r) => r.label)).toEqual([
    'Capstone',
    'Capstone Software Presentation',
  ]);
  expect(search('solar', index).map((r) => r.label)).toEqual(['Capstone']);
  expect(search('capstone fiction', index)).toEqual([]);
  expect(search('vignette', index)[0]).not.toHaveProperty('text');
});

test('nothing typed is nothing to show', () => {
  expect(answer('   ', index, SNAPSHOTS)).toEqual({ type: 'empty' });
});
