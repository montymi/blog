import { expect, test } from 'vitest';

import { publicationName } from './publication';

test('publication labels recognize publishers and preserve unknown domains', () => {
  expect(publicationName('https://www.blitzy.com/blog/chess')).toBe('Blitzy');
  expect(publicationName('https://michaelmontanaro.substack.com/p/preseason')).toBe('Substack');
  expect(publicationName('https://example.com/article')).toBe('example.com');
  expect(publicationName('https://notblitzy.com/article')).toBe('notblitzy.com');
});
