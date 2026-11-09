import { expect, test } from 'vitest';

import { rawThemes, resolve, themes } from './themes';

test('every item a theme names exists, and none is in two themes', () => {
  const seen = new Set<string>();
  for (const theme of rawThemes) {
    for (const ref of theme.items) {
      expect(resolve(ref), `${theme.id} names ${ref}, which doesn't exist`).not.toBeNull();
      expect(seen.has(ref), `${ref} is in two themes`).toBe(false);
      seen.add(ref);
    }
  }
});

test('themes keep their order and their items resolve to places', () => {
  expect(themes.map((t) => t.id)[0]).toBe('everyday-apps');
  const stories = themes.find((t) => t.id === 'teams-and-stories')!;
  expect(stories.entries[0]).toEqual({
    kind: 'post',
    title: 'Preseason',
    href: 'https://michaelmontanaro.substack.com/p/preseason',
    away: true,
  });
});
