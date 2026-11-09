export const getRepoNameFromUrl = (url: string): string => {
  const parts = url.split('/');
  return parts[parts.length - 3];
};

/** Given a GitHub API commit URL, builds the `https://github.com/{owner}/{repo}` link. */
export const getRepoLinkFromUrl = (url: string): string => {
  const parts = url.split('/');
  const owner = parts[parts.length - 4];
  const repo = parts[parts.length - 3];
  return `https://github.com/${owner}/${repo}`;
};
