import { useEffect, useState } from 'react';

import { askAbove } from '@/lib/ask';
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
        ? [`Up · ${status.ms} ms`, 'bg-accent']
        : ['Not answering', 'bg-bad'];
  return (
    <span className="kicker flex items-center gap-2">
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${lamp}`} />
      {word}
    </span>
  );
}

/** An app's address with the mark's green square for its dot: chef▪montymi.com. */
function Address({ url }: { url: string }) {
  const [sub, ...rest] = url.replace('https://', '').split('.');
  return (
    <span className="font-mono text-xs text-muted underline decoration-line-strong underline-offset-4 group-hover:text-ink">
      <span className="text-ink">{sub}</span>
      <span aria-hidden="true" className="mx-px inline-block h-1 w-1 bg-accent align-middle" />
      <span className="sr-only">.</span>
      {rest.join('.')}
    </span>
  );
}

/** What an app's language looks like: its name, and one example to put on the line above. */
function Speaks({ app }: { app: Manifest }) {
  if (!app.language) return null;
  const example = app.language.examples[0];
  return (
    <div className="flex flex-col items-start gap-2 border-t border-line pt-4">
      <span className="text-xs text-muted">Speaks {app.language.name}</span>
      <button
        type="button"
        onClick={() => {
          askAbove(example);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label={`Try “${example}” on the command line`}
        className="focus-ring rounded-sm border border-line bg-inset px-2 py-1 font-mono text-[0.8125rem] text-ink hover:border-line-strong"
      >
        {example}&nbsp;<span aria-hidden="true">↑</span>
      </button>
    </div>
  );
}

/**
 * The apps montymi.com fronts, one card each, read from their manifests, with whether they're
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
    <div className="flex flex-col gap-4">
      <ul className="grid gap-4 sm:grid-cols-2">
        {SNAPSHOTS.map((app) => (
          <li
            key={app.id}
            className="flex flex-col gap-4 rounded border border-line bg-raised p-4 hover:border-line-strong"
          >
            <a href={app.url} className="focus-ring group flex flex-1 flex-col gap-2 rounded-sm">
              <span className="flex items-center justify-between gap-3">
                <Lamp status={statuses?.[app.id]} known={statuses !== null} />
                <Address url={app.url} />
              </span>
              <span className="text-[1.1875rem] font-semibold leading-7 group-hover:text-accent">
                {app.name}
              </span>
              <span className="text-sm text-muted">{app.about}</span>
            </a>
            <Speaks app={app} />
          </li>
        ))}
      </ul>
      {assistants.length > 0 && (
        <div className="flex flex-col gap-3 rounded border border-dashed border-line-strong p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-semibold">Use them with Claude</h3>
            <p className="text-xs text-muted">
              Connect an app to Claude, and ask for a week or a question in plain words.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {assistants.map((app) => (
              <a
                key={app.id}
                href={app.assistant!.connect}
                className="btn-secondary min-h-9 px-3 py-1 text-xs"
              >
                Connect {app.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
