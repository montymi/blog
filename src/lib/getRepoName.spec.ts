import { expect, test } from 'vitest';

import { getRepoLinkFromUrl, getRepoNameFromUrl } from './getRepoName';

const COMMIT_URL = 'https://api.github.com/repos/montymi/montymi/commits/abc123';

test('getRepoNameFromUrl: extracts the repo name', () => {
  expect(getRepoNameFromUrl(COMMIT_URL)).toBe('montymi');
});

test('getRepoLinkFromUrl: builds the github.com repo link', () => {
  expect(getRepoLinkFromUrl(COMMIT_URL)).toBe('https://github.com/montymi/montymi');
});
