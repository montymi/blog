import { useEffect, useState } from 'react';

import { readCheck, type Check, type Manifest } from './contract';

/**
 * The app's reading of a sentence, asked through montymi.com's `/api/check` once typing pauses.
 * `pending` while asking; `check` null when the app didn't answer (the sentence can still be sent).
 */
export function useCheck(app: Manifest | null, text: string, wait = 250) {
  const [state, setState] = useState<{ for: string; check: Check | null } | null>(null);
  const query = text.trim();
  useEffect(() => {
    if (!app?.language || !query) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/check?app=${app.id}&q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) =>
          setState({ for: `${app.id}:${query}`, check: data ? readCheck(data.check) : null }),
        )
        .catch(() => {
          if (!controller.signal.aborted) setState({ for: `${app.id}:${query}`, check: null });
        });
    }, wait);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [app, query, wait]);
  const current = app && state?.for === `${app.id}:${query}` ? state : null;
  return { check: current?.check ?? null, pending: Boolean(app?.language && query) && !current };
}
