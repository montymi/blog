import { expect, test } from 'vitest';

import { normalizeHistoryEvents } from './history';

test('normalizeHistoryEvents: maps a valid events array', () => {
  const data = { events: [{ year: 1990, content: 'Something happened.' }] };
  expect(normalizeHistoryEvents(data)).toEqual([{ year: 1990, content: 'Something happened.' }]);
});

test('normalizeHistoryEvents: returns an empty array when events is missing', () => {
  expect(normalizeHistoryEvents({})).toEqual([]);
});

test('normalizeHistoryEvents: returns an empty array when events is not an array', () => {
  expect(normalizeHistoryEvents({ events: 'nope' })).toEqual([]);
});

test('normalizeHistoryEvents: returns an empty array for null/undefined input', () => {
  expect(normalizeHistoryEvents(null)).toEqual([]);
  expect(normalizeHistoryEvents(undefined)).toEqual([]);
});
