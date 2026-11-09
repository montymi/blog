import { useEffect, useState } from 'react';

import type { Manifest } from '@/platform/contract';
import { SNAPSHOTS } from '@/platform/registry';
import type { Status } from '@/platform/server';

/** A lamp and a word: never colour alone. Unknown until the check answers. */
function Lamp({ status, known }: { status?: Status; known: boolean }) {
  const [word, lamp] = !known
    ? ['Checking', 'bg-line-strong motion-safe:animate-pulse']
    : !status
      ? ['Status unknown', 'bg-line-strong']
      : status.up
        ? [`Up, ${status.ms} ms`, 'bg-accent']
        : ['Not answering', 'bg-bad'];
  return (
    <span className="flex items-center gap-2 font-mono text-xs text-muted">
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${lamp}`} />
      {word}
    </span>
  );
}

/** What an app's language looks like, for its row: its words, and one example to try. */
function Speaks({ app }: { app: Manifest }) {
  if (!app.language) return null;
  return (
    <span className="text-xs text-muted">
      Speaks {app.language.name}:{' '}
      <span className="font-mono text-ink">{app.language.examples[0]}</span>
    </span>
  );
}

/**
 * The apps montymi.com fronts, one row each, read from their manifests, with whether they're
 * answering right now. A new app appears here by being added to the registry.
 */
export function Switchboard() {
  const [statuses, setStatuses] = useState<Record<string, Status> | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/status', { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: { apps: Status[] }) =>
        setStatuses(Object.fromEntries(data.apps.map((a) => [a.id, a]))),
      )
      .catch(() => {
        if (!controller.signal.aborted) setStatuses({});
      });
    return () => controller.abort();
  }, []);
  const assistants = SNAPSHOTS.filter((app) => app.assistant?.connect);

  return (
    <ul className="flex flex-col border-t border-ink/80">
      {SNAPSHOTS.map((app) => (
        <li key={app.id} className="border-b border-line">
          <a
            href={app.url}
            className="focus-ring group grid min-h-11 grid-cols-1 gap-x-6 gap-y-1 py-4 sm:grid-cols-[9rem_1fr_auto] sm:items-baseline"
          >
            <Lamp status={statuses?.[app.id]} known={statuses !== null} />
            <span className="flex flex-col gap-0.5">
              <span className="text-[1.3125rem] font-semibold leading-7 group-hover:text-accent">
                {app.name}
              </span>
              <span className="text-sm text-muted">{app.about}</span>
              <Speaks app={app} />
            </span>
            <span className="font-mono text-sm text-muted group-hover:text-ink">
              {app.url.replace('https://', '')}
            </span>
          </a>
        </li>
      ))}
      {assistants.length > 0 && (
        <li className="grid gap-x-6 gap-y-1 border-b border-line py-4 sm:grid-cols-[9rem_1fr_auto] sm:items-baseline">
          <span className="font-mono text-xs text-muted">Assistant</span>
          <span className="flex flex-col gap-0.5">
            <span className="text-[1.3125rem] font-semibold leading-7">Use them with Claude</span>
            <span className="text-sm text-muted">
              Connect an app to Claude, and ask for a week or a question in plain words.
            </span>
          </span>
          <span className="flex flex-wrap gap-x-4">
            {assistants.map((app) => (
              <a
                key={app.id}
                href={app.assistant!.connect}
                className="link inline-flex min-h-11 items-center text-sm"
              >
                {app.name}
              </a>
            ))}
          </span>
        </li>
      )}
    </ul>
  );
}
