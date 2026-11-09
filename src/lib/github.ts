export interface GitHubEvent {
  type?: string;
  repo?: { name: string };
  created_at?: string;
  payload: {
    head?: string;
  };
}

export interface PushRef {
  repo: string;
  sha: string;
}

/** The newest push in a user's recent events (the API does not promise their order). */
export function latestPush(events: GitHubEvent[]): (PushRef & { at: string }) | null {
  const pushes = events
    .filter(
      (event) =>
        event.type === 'PushEvent' && event.repo?.name && event.payload.head && event.created_at,
    )
    .sort((a, b) => b.created_at!.localeCompare(a.created_at!));
  const newest = pushes[0];
  return newest
    ? { repo: newest.repo!.name, sha: newest.payload.head!, at: newest.created_at! }
    : null;
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
