import { useCallback, useEffect, useRef, useState } from 'react';

import { commitUrl, isRateLimited, rateLimitResetDelayMs, selectRandomPushes } from '@/lib/github';
import { retryWithBackoff } from '@/lib/retry';
import useNotifications from '@/store/notifications';

export interface Commit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
  url: string;
  html_url: string;
  author: {
    avatar_url: string;
    followers_url: string;
    following_url: string;
    starred_url: string;
  };
  stats: {
    total: number;
    additions: number;
    deletions: number;
  };
}

/**
 * Custom hook to fetch the latest commit from any GitHub repository of a user.
 *
 * @param {string} username - The GitHub username.
 * @returns {Object} - An object containing the latest commit, loading state, and a refetch function.
 */
const useLatestCommits = (
  username: string,
): { commits: Commit[]; loading: boolean; refetch: () => void } => {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [, notificationsActions] = useNotifications();
  // Only the very first load should show the spinner. A refetch (the manual
  // "refresh" button) keeps whatever's already on screen visible the whole
  // time — flashing back to a spinner for a result that's often identical
  // (this account rarely has more than a couple of recent public pushes) is
  // what actually read as "glitchy", not the refetch itself.
  const isFirstLoad = useRef(true);

  const fetchLatestCommits = useCallback(
    async (signal?: AbortSignal) => {
      if (isFirstLoad.current) setLoading(true);
      try {
        const fetchWithRetry = (url: string) =>
          retryWithBackoff(() => fetch(url, { signal }), {
            retries: 3,
            shouldRetry: isRateLimited,
            delayMs: (_attempt, response) => (response ? rateLimitResetDelayMs(response) : 1000),
          });

        const response = await fetchWithRetry(`https://api.github.com/users/${username}/events`);
        const data = await response.json();

        const pushes = selectRandomPushes(data, 5);
        const fetchedCommits = await Promise.all(
          pushes.map((push) => fetchWithRetry(commitUrl(push)).then((res) => res.json())),
        );

        setCommits((previous) => {
          const previousShas = new Set(previous.map((commit) => commit.sha));
          const hasNothingNew =
            previous.length > 0 && fetchedCommits.every((commit) => previousShas.has(commit.sha));

          if (hasNothingNew) {
            notificationsActions.push({ message: 'No new commits to public repos recently.' });
            return previous;
          }

          return fetchedCommits;
        });
      } catch (error: unknown) {
        // StrictMode mounts every component twice in dev, which aborts this
        // first, throwaway call — that's expected, not a real failure.
        if (error instanceof DOMException && error.name === 'AbortError') return;

        if (error instanceof Error) {
          console.error('Error fetching latest commits:', error.message);
        } else {
          console.error('An unknown error occurred while fetching latest commits');
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
          isFirstLoad.current = false;
        }
      }
    },
    [username, notificationsActions],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchLatestCommits(controller.signal);
    return () => controller.abort();
  }, [fetchLatestCommits]);

  return { commits, loading, refetch: () => fetchLatestCommits() };
};

export default useLatestCommits;
