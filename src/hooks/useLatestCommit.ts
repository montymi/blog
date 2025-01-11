import { useState, useEffect, useCallback } from 'react';

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
const useLatestCommit = (
  username: string,
): { commits: Commit[]; loading: boolean; refetch: () => void } => {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLatestCommits = useCallback(async () => {
    try {
      const fetchWithRetry = async (
        url: string,
        retries: number = 3,
        delay: number = 1000,
      ): Promise<Response> => {
        for (let i = 0; i < retries; i++) {
          const response = await fetch(url);
          if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
            const resetTime = response.headers.get('X-RateLimit-Reset');
            const waitTime = resetTime ? parseInt(resetTime) * 1000 - Date.now() : delay;
            await new Promise((resolve) => setTimeout(resolve, waitTime));
          } else {
            return response;
          }
        }
        throw new Error('Rate limit exceeded');
      };

      const response = await fetchWithRetry(`https://api.github.com/users/${username}/events`);
      const data = await response.json();
      const randomStart = Math.floor(Math.random() * (data.length - 5));
      const commitPromises = data
        .slice(randomStart, randomStart + 5)
        .map((event: { payload: { commits: { url: string }[] } }) =>
          fetchWithRetry(event.payload.commits[0].url).then((res) => res.json()),
        );
      const commitsData = await Promise.all(commitPromises);
      console.log('commitsData:', commitsData);
      setCommits(commitsData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching latest commits:', error.message);
      } else {
        console.error('An unknown error occurred while fetching latest commits');
      }
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchLatestCommits();
  }, [fetchLatestCommits]);

  return { commits, loading, refetch: fetchLatestCommits };
};

export default useLatestCommit;
