import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Reading } from '@/components/Command';
import { Meta, PageHeader } from '@/components/ui';
import { fill, route } from '@/platform/contract';
import { SNAPSHOTS } from '@/platform/registry';
import { useCheck } from '@/platform/useCheck';

/**
 * montymi.com/q/<sentence>: a sentence in one of the apps' languages, as a link anyone can open.
 * It shows how the app reads it, and one button to run it there.
 */
function Ask() {
  const { '*': raw = '' } = useParams();
  const query = (() => {
    try {
      return decodeURIComponent(raw).trim();
    } catch {
      return raw.trim();
    }
  })();
  const app = route(query, SNAPSHOTS);
  const { check, pending } = useCheck(app, query, 0);
  const [copied, setCopied] = useState(false);

  if (!app?.language) {
    return (
      <div className="flex flex-col items-start gap-6">
        <Meta title="Not a request" />
        <PageHeader title="Not a request any app reads">
          “{query}” doesn’t start with a word one of the apps owns. Try{' '}
          {SNAPSHOTS.flatMap((a) => a.language?.examples.slice(0, 1) ?? []).map((example, i) => (
            <span key={example}>
              {i > 0 && ' or '}
              <Link to={`/q/${encodeURIComponent(example)}`} className="link font-mono font-normal">
                {example}
              </Link>
            </span>
          ))}
          .
        </PageHeader>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Meta title={query} description={`A request for ${app.name}: ${query}`} />
      <PageHeader kicker={`A request for ${app.name}`} title="Sent from montymi.com" />
      <Reading app={app} query={query} check={check} pending={pending} />
      <div className="flex flex-wrap gap-3">
        <a
          href={fill(app.language.open, query)}
          aria-disabled={Boolean(check && !check.ok)}
          className={`btn-primary ${check && !check.ok ? 'pointer-events-none opacity-45' : ''}`}
        >
          Open in {app.name}
        </a>
        <button
          type="button"
          className="btn-secondary"
          onClick={() =>
            navigator.clipboard?.writeText(window.location.href).then(() => setCopied(true))
          }
        >
          {copied ? 'Link copied' : 'Copy this link'}
        </button>
      </div>
      <p className="max-w-prose text-sm text-muted">
        {app.about} Every request in {app.language.name} has an address like this one, so you can
        send it to someone.
      </p>
    </div>
  );
}

export default Ask;
