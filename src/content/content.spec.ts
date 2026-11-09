import { expect, test } from 'vitest';

import {
  papers,
  postBySlug,
  posts,
  projectBySlug,
  projects,
  readPost,
  summarize,
  withoutTitle,
} from '.';

test('every post has a slug, a title and a calendar date, newest first', () => {
  expect(posts.length).toBeGreaterThan(0);
  for (const post of posts) {
    expect(post.slug).toMatch(/^[a-z0-9-]+$/);
    expect(post.title).not.toBe('');
    expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  }
  const dates = posts.map((p) => p.date);
  expect(dates).toEqual([...dates].sort().reverse());
});

test('a post page does not repeat its title as the first heading', () => {
  const post = postBySlug('talking-docs')!;
  expect(post.body.startsWith('# Talking Docs')).toBe(false);
  expect(withoutTitle('# Welcome to the blog!\nText', 'Welcome!')).toBe(
    '# Welcome to the blog!\nText',
  );
});

test('a summary is plain text from the first paragraph', () => {
  const post = readPost(
    'x/italic.md',
    '---\ntitle: T\n---\n*A subtitle*\n\nSee [the docs](https://x.y) for **more**.\n',
  );
  expect(post.summary).toBe('See the docs for more.');
  expect(summarize('word '.repeat(80)).length).toBeLessThanOrEqual(160);
});

test('every project has a known shape', () => {
  expect(projects.length).toBeGreaterThan(0);
  for (const project of projects) {
    expect(['album', 'episode', 'single']).toContain(project.kind);
    expect(['published', 'draft', 'archived']).toContain(project.status);
    expect(project.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  }
  expect(projectBySlug('lazygrocer')?.live).toBe('https://chef.montymi.com');
  expect(projectBySlug('coding-from-zero')?.audio).toBe('/audio/coding-from-zero.mp3');
});

test('every paper is a PDF in public/library', () => {
  for (const paper of papers) expect(paper.file).toMatch(/^\/library\/.+\.pdf$/);
});
