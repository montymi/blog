import { expect, test } from 'vitest';

import { mapWikipediaEvents } from './wikipediaEvents';

test('mapWikipediaEvents: maps text/year into content/year', () => {
  const data = { events: [{ year: 1990, text: 'Something happened.' }] };
  expect(mapWikipediaEvents(data)).toEqual([{ year: 1990, content: 'Something happened.' }]);
});

test('mapWikipediaEvents: returns an empty array when events is missing', () => {
  expect(mapWikipediaEvents({})).toEqual([]);
});
