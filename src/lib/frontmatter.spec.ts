import { expect, test } from 'vitest';

import { parseFrontmatter } from './frontmatter';

test('reads strings, quoted strings, numbers and lists', () => {
  const { data, body } = parseFrontmatter(
    '---\nid: 3\ntitle: "Talking Docs"\ndate: 2024-12-01\ntags: ["vignette", "short story"]\n---\n\n# Hi\n',
  );
  expect(data).toEqual({
    id: 3,
    title: 'Talking Docs',
    date: '2024-12-01',
    tags: ['vignette', 'short story'],
  });
  expect(body).toBe('\n# Hi\n');
});

test('a file without frontmatter is all body', () => {
  expect(parseFrontmatter('# Just text')).toEqual({ data: {}, body: '# Just text' });
});
