// filepath: /Users/michaelmontanaro/Private/Projects/blog/src/hooks/useLatestCommit.ts
import { useState, useEffect, useCallback } from 'react';
import client from '@/utils/redis-client';

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

const useLatestCommits = (
  username: string,
): { commits: Commit[]; loading: boolean; refetch: () => void } => {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLatestCommits = useCallback(async () => {
    try {
      const cacheKey = `github:commits:${username}`;
      const cachedData = await client.get(cacheKey);

      if (cachedData) {
        setCommits(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

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
      interface GitHubEvent {
        payload: {
          commits: {
            url: string;
          }[];
        };
      }

      const commitPromises: Promise<Commit | null>[] = data
        .slice(randomStart, randomStart + 5)
        .map((event: GitHubEvent) => {
          if (event.payload.commits && event.payload.commits.length > 0) {
            return fetchWithRetry(event.payload.commits[0].url).then((res) => res.json());
          }
          return null;
        })
        .filter((commit: Promise<Commit> | null): commit is Promise<Commit> => commit !== null);

      if (commitPromises.length < 5) {
        const additionalCommits = data
          .slice(0, 5 - commitPromises.length)
          .map((event: GitHubEvent) => {
            if (event.payload.commits && event.payload.commits.length > 0) {
              return fetchWithRetry(event.payload.commits[0].url).then((res) => res.json());
            }
            return null;
          })
          .filter((commit: Promise<Commit> | null): commit is Promise<Commit> => commit !== null);

        commitPromises.push(...additionalCommits);
      }

      const commitsData = await Promise.all(commitPromises);
      const filteredCommits = commitsData.filter((commit): commit is Commit => commit !== null);

      await client.set(cacheKey, JSON.stringify(filteredCommits), {
        EX: 3600, // Cache for 1 hour
      });

      setCommits(filteredCommits);
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

export default useLatestCommits;
