import { expect, test } from 'vitest';

import { commitUrl, selectRandomPushes, splitCommitMessage, type GitHubEvent } from './github';

function pushEvent(repo: string, sha: string): GitHubEvent {
  return { type: 'PushEvent', repo: { name: repo }, payload: { head: sha } };
}

test('selectRandomPushes: returns all pushes when fewer than count exist', () => {
  const events = [pushEvent('a/a', 'sha-a'), pushEvent('b/b', 'sha-b')];
  expect(selectRandomPushes(events, 5)).toHaveLength(2);
});

test('selectRandomPushes: ignores non-PushEvents and incomplete pushes', () => {
  const events = [
    pushEvent('a/a', 'sha-a'),
    { type: 'WatchEvent', repo: { name: 'b/b' }, payload: {} },
    { type: 'PushEvent', payload: {} }, // no repo/head
  ];
  expect(selectRandomPushes(events, 5)).toEqual([{ repo: 'a/a', sha: 'sha-a' }]);
});

test('selectRandomPushes: returns exactly count pushes when more are available', () => {
  const events = Array.from({ length: 10 }, (_, i) => pushEvent(`repo/${i}`, `sha-${i}`));
  const result = selectRandomPushes(events, 5);
  expect(result).toHaveLength(5);
  result.forEach((push) => expect(events.map((e) => e.payload.head)).toContain(push.sha));
});

test('commitUrl: builds the single-commit API URL', () => {
  expect(commitUrl({ repo: 'montymi/blog', sha: 'abc123' })).toBe(
    'https://api.github.com/repos/montymi/blog/commits/abc123',
  );
});

test('splitCommitMessage: separates the summary from a multi-line body', () => {
  expect(splitCommitMessage('docs: rewrite bio\n\nReplace the old section.')).toEqual({
    summary: 'docs: rewrite bio',
    body: 'Replace the old section.',
  });
});

test('splitCommitMessage: returns an empty body for a one-line message', () => {
  expect(splitCommitMessage('fix: typo')).toEqual({ summary: 'fix: typo', body: '' });
});
