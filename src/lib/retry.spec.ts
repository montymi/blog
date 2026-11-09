import { expect, test, vi } from 'vitest';

import { retryWithBackoff } from './retry';

test('retryWithBackoff: returns the result on first success', async () => {
  const operation = vi.fn().mockResolvedValue('ok');
  await expect(retryWithBackoff(operation, { delayMs: 0 })).resolves.toBe('ok');
  expect(operation).toHaveBeenCalledTimes(1);
});

test('retryWithBackoff: retries on throw until it succeeds', async () => {
  const operation = vi
    .fn()
    .mockRejectedValueOnce(new Error('fail'))
    .mockRejectedValueOnce(new Error('fail'))
    .mockResolvedValue('ok');

  await expect(retryWithBackoff(operation, { retries: 3, delayMs: 0 })).resolves.toBe('ok');
  expect(operation).toHaveBeenCalledTimes(3);
});

test('retryWithBackoff: rethrows after exhausting retries', async () => {
  const operation = vi.fn().mockRejectedValue(new Error('always fails'));

  await expect(retryWithBackoff(operation, { retries: 2, delayMs: 0 })).rejects.toThrow(
    'always fails',
  );
  expect(operation).toHaveBeenCalledTimes(3);
});

test('retryWithBackoff: retries a resolved value via shouldRetry', async () => {
  const operation = vi.fn().mockResolvedValueOnce('retry me').mockResolvedValue('done');

  await expect(
    retryWithBackoff(operation, {
      retries: 2,
      delayMs: 0,
      shouldRetry: (result) => result === 'retry me',
    }),
  ).resolves.toBe('done');
  expect(operation).toHaveBeenCalledTimes(2);
});
