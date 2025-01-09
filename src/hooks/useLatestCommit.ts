import { useState, useEffect } from 'react';

interface Commit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
  url: string;
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

interface LatestCommitHook {
  commit: Commit | null;
  loading: boolean;
}

/**
 * Custom hook to fetch the latest commit from any GitHub repository of a user.
 *
 * @param {string} username - The GitHub username.
 * @returns {Object} - An object containing the latest commit and loading state.
 */
const useLatestCommit = (username: string): LatestCommitHook => {
  const [commit, setCommit] = useState<Commit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestCommit = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}/events`);
        const data = await response.json();
        const pushEvent = data.find((event: { type: string }) => event.type === 'PushEvent');
        if (pushEvent) {
          const commitUrl = pushEvent.payload.commits[0].url;
          const commitResponse = await fetch(commitUrl);
          const commitData = await commitResponse.json();
          setCommit(commitData);
        }
      } catch (error) {
        console.error('Error fetching latest commit:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestCommit();
  }, [username]);

  return { commit, loading };
};

export default useLatestCommit;
