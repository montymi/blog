/**
 * What montymi.com's server functions (_api/) ask the apps. Each call has a short timeout and a
 * plain answer when an app is down: the hub degrades to its snapshots, never to an error page.
 */
import { fill, readCheck, readManifest, type Check, type Manifest } from './contract';
import { REGISTRY, SNAPSHOTS, manifestUrl } from './registry';

const TIMEOUT = 4000;

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': 'montymi.com' },
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (!response.ok) throw new Error(`${url} answered ${response.status}`);
  return response.json();
}

export interface Known {
  manifest: Manifest;
  /** "live" when the app answered with a valid manifest just now; else the bundled snapshot. */
  source: 'live' | 'snapshot';
}

/** Every registered app's manifest: live where it answers and keeps the contract. */
export async function manifests(): Promise<Known[]> {
  return Promise.all(
    REGISTRY.map(async ({ origin }, i): Promise<Known> => {
      try {
        const live = readManifest(await getJson(manifestUrl(origin)));
        if (live && live.url === origin) return { manifest: live, source: 'live' };
      } catch {
        // Down, redeploying, or not publishing a manifest yet: the snapshot stands in.
      }
      return { manifest: SNAPSHOTS[i], source: 'snapshot' };
    }),
  );
}

/** Ask an app to read a sentence. Null when the app has no language or didn't answer. */
export async function check(appId: string, query: string): Promise<Check | null> {
  const known = (await manifests()).find(({ manifest }) => manifest.id === appId)?.manifest;
  if (!known?.language || !query.trim()) return null;
  try {
    return readCheck(await getJson(fill(known.language.check, query.slice(0, 500))));
  } catch {
    return null;
  }
}

export interface Status {
  id: string;
  up: boolean;
  /** Round trip in milliseconds, or null when the app didn't answer. */
  ms: number | null;
}

/** Whether each app's health address answers 2xx right now. */
export async function status(): Promise<Status[]> {
  const known = await manifests();
  return Promise.all(
    known.map(async ({ manifest }): Promise<Status> => {
      const started = Date.now();
      try {
        const response = await fetch(manifest.health, { signal: AbortSignal.timeout(TIMEOUT) });
        return { id: manifest.id, up: response.ok, ms: Date.now() - started };
      } catch {
        return { id: manifest.id, up: false, ms: null };
      }
    }),
  );
}
