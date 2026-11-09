import { expect, test } from 'vitest';

import type { Project } from '@/content';

import { FOOT, ROWS, keptFor, place } from './skyline';

const project = (
  slug: string,
  kind: Project['kind'],
  released: string,
  updated: string,
): Project => ({
  slug,
  title: slug,
  kind,
  version: '1.0.0',
  status: 'published',
  description: '',
  released,
  updated,
});

test('blocks in one row never overlap, even when released the same week', () => {
  const { blocks } = place([
    project('a', 'single', '2024-01-01', '2024-01-01'),
    project('b', 'single', '2024-01-03', '2024-06-01'),
    project('c', 'single', '2024-01-05', '2024-02-01'),
    project('d', 'album', '2025-01-01', '2025-03-01'),
  ]);
  const singles = blocks.filter((b) => b.project.kind === 'single').sort((p, q) => p.x - q.x);
  for (let i = 1; i < singles.length; i++)
    expect(singles[i].x - singles[i - 1].x).toBeGreaterThanOrEqual(FOOT);
  expect(blocks.find((b) => b.project.slug === 'd')!.y).toBeLessThan(singles[0].y); // albums stand at the back
  expect(ROWS[0]).toBe('album');
});

test('the longer a project was kept, the taller it stands', () => {
  const { blocks } = place([
    project('short', 'episode', '2024-01-01', '2024-01-10'),
    project('long', 'episode', '2024-03-01', '2025-03-01'),
  ]);
  const height = (slug: string) => blocks.find((b) => b.project.slug === slug)!.height;
  expect(height('long')).toBeGreaterThan(height('short'));
});

test('time kept reads in days, months or years', () => {
  expect(keptFor(project('x', 'single', '2024-01-01', '2024-01-01'))).toBe('released once');
  expect(keptFor(project('x', 'single', '2024-01-01', '2024-01-10'))).toBe('kept 9 days');
  expect(keptFor(project('x', 'single', '2024-01-01', '2024-07-01'))).toBe('kept 6 months');
  expect(keptFor(project('x', 'single', '2022-01-01', '2025-01-01'))).toBe('kept 3 years');
});

test('a project with no release date yet stands at its last update', () => {
  const unreleased = project('sesh', 'album', 'TBD', '2025-01-22');
  const { blocks } = place([unreleased, project('a', 'album', '2024-01-01', '2024-02-01')]);
  for (const block of blocks)
    expect(Number.isFinite(block.x) && Number.isFinite(block.height)).toBe(true);
  expect(keptFor(unreleased)).toBe('not released yet');
});
