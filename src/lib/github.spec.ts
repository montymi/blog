import { expect, test } from 'vitest';

import { commitUrl, latestPush, splitCommitMessage, type GitHubEvent } from './github';

function pushEvent(repo: string, sha: string): GitHubEvent {
  return { type: 'PushEvent', repo: { name: repo }, payload: { head: sha } };
}

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

test('latestPush: the newest push by time, whatever order the events come in', () => {
  const events: GitHubEvent[] = [
    { ...pushEvent('montymi/LazyGrocer', 'old'), created_at: '2026-11-07T23:48:21Z' },
    { type: 'WatchEvent', repo: { name: 'x/x' }, payload: {}, created_at: '2026-11-09T00:00:00Z' },
    { ...pushEvent('montymi/blog', 'new'), created_at: '2026-11-08T21:52:37Z' },
  ];
  expect(latestPush(events)).toEqual({
    repo: 'montymi/blog',
    sha: 'new',
    at: '2026-11-08T21:52:37Z',
  });
  expect(latestPush([])).toBeNull();
});
