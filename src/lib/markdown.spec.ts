import { expect, test } from 'vitest';

import { parseMarkdown } from './markdown';

test('parseMarkdown: splits frontmatter from content', () => {
  const text = ['---', 'title: Hello', 'id: 42', '---', '', 'Body text.'].join('\n');

  const { data, content } = parseMarkdown(text);

  expect(data).toMatchObject({ title: 'Hello', id: 42 });
  expect(content.trim()).toBe('Body text.');
});

test('parseMarkdown: handles content with no frontmatter', () => {
  const { data, content } = parseMarkdown('Just a body, no frontmatter.');

  expect(data).toEqual({});
  expect(content).toBe('Just a body, no frontmatter.');
});
