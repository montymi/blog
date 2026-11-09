import sleep from '@/utils/sleep';

export interface RetryOptions<T> {
  /** Maximum number of retries after the first attempt. Defaults to 3. */
  retries?: number;
  /** Delay before the next attempt, in ms, or a function of the attempt index / last result. */
  delayMs?: number | ((attempt: number, result?: T) => number);
  /**
   * Called with a resolved (non-throwing) result to decide whether to retry it.
   * Omit for "retry only on throw" (e.g. a flaky network call) behavior.
   */
  shouldRetry?: (result: T) => boolean;
}

/**
 * Retry an async operation, either because it threw or because a resolved
 * result still needs another attempt (e.g. an HTTP 429/403 response).
 *
 * One shared implementation for two different retry shapes blog previously
 * hand-rolled independently: a throw-and-retry loop (PDF page-count lookup)
 * and a resolve-but-check-the-response loop (GitHub rate-limit backoff).
 */
export async function retryWithBackoff<T>(
  operation: (attempt: number) => Promise<T>,
  { retries = 3, delayMs = 1000, shouldRetry }: RetryOptions<T> = {},
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      const result = await operation(attempt);
      if (attempt === retries || !shouldRetry?.(result)) return result;
      await sleep(typeof delayMs === 'function' ? delayMs(attempt, result) : delayMs);
    } catch (error) {
      if (attempt === retries) throw error;
      await sleep(typeof delayMs === 'function' ? delayMs(attempt) : delayMs);
    }
  }
}
