export interface GitHubEvent {
  type?: string;
  repo?: { name: string };
  payload: {
    head?: string;
  };
}

export interface PushRef {
  repo: string;
  sha: string;
}

/**
 * Pick up to `count` pushes from a user's recent GitHub events, in a random
 * contiguous window so repeat visits don't always see the same ones. The
 * events API no longer inlines commit data on a PushEvent (just `repo.name`
 * + the pushed-to `payload.head` SHA), so each ref here still needs its own
 * `/repos/{repo}/commits/{sha}` lookup — see {@link commitUrl}.
 */
export function selectRandomPushes(events: GitHubEvent[], count = 5): PushRef[] {
  const pushes = events
    .filter((event) => event.type === 'PushEvent' && event.repo?.name && event.payload.head)
    .map((event) => ({ repo: event.repo!.name, sha: event.payload.head! }));

  if (pushes.length <= count) return pushes;

  const randomStart = Math.floor(Math.random() * (pushes.length - count));
  return pushes.slice(randomStart, randomStart + count);
}

/** The single-commit API URL for a push, which carries the full commit + stats. */
export function commitUrl({ repo, sha }: PushRef): string {
  return `https://api.github.com/repos/${repo}/commits/${sha}`;
}

export interface CommitMessage {
  /** The commit's first line — conventionally the subject/title. */
  summary: string;
  /** Everything after the first line, trimmed. Empty when the message is one line. */
  body: string;
}

/** Splits a raw git commit message into its summary line and body, for display. */
export function splitCommitMessage(message: string): CommitMessage {
  const [summary, ...rest] = message.split('\n');
  return { summary, body: rest.join('\n').trim() };
}

/** Computes how long to wait before retrying a GitHub API call rate-limited with a 403. */
export function isRateLimited(response: Response): boolean {
  return response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0';
}

export function rateLimitResetDelayMs(response: Response, fallbackMs = 1000): number {
  const resetTime = response.headers.get('X-RateLimit-Reset');
  return resetTime ? parseInt(resetTime, 10) * 1000 - Date.now() : fallbackMs;
}
