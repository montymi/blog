import { commitUrl, latestPush, splitCommitMessage, type GitHubEvent } from './github';

export interface Shipped {
  /** The commit's first line, e.g. "feat(planner): never three days of one dish". */
  summary: string;
  /** The repository's name without its owner, e.g. "LazyGrocer". */
  repo: string;
  /** When it was pushed (ISO 8601). */
  at: string;
  url: string;
}

/**
 * The newest commit a user pushed to a public repository, or null when there is none or
 * GitHub won't say (rate limits, an outage). Runs on the server (`api/shipped.ts`), so one
 * cached call serves every visitor; `token` raises GitHub's limit when set.
 */
export async function lastShipped(user: string, token?: string): Promise<Shipped | null> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'montymi.com',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const events = await fetch(`https://api.github.com/users/${user}/events?per_page=50`, {
    headers,
  });
  if (!events.ok) return null;
  const list = (await events.json()) as GitHubEvent[];
  const push = Array.isArray(list) ? latestPush(list) : null;
  if (!push) return null;
  const commit = await fetch(commitUrl(push), { headers });
  if (!commit.ok) return null;
  const data = (await commit.json()) as { html_url?: string; commit?: { message?: string } };
  if (typeof data.commit?.message !== 'string' || !data.html_url) return null;
  return {
    summary: splitCommitMessage(data.commit.message).summary,
    repo: push.repo.split('/')[1] ?? push.repo,
    at: push.at,
    url: data.html_url,
  };
}
