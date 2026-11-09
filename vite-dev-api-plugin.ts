import type { Plugin } from 'vite';

import { lastShipped } from './src/lib/shipped';
import { check, manifests, status } from './src/platform/server';

/**
 * `vite dev` and `vite preview` never run the Vercel functions in `api/` (vite-plugin-vercel
 * only bundles them at build time), so this middleware answers every `/api/*` route the same way locally.
 */
async function shipped(_req: unknown, res: import('http').ServerResponse) {
  let answer = null;
  try {
    answer = await lastShipped('montymi', process.env.GITHUB_TOKEN);
  } catch {
    // Same as production: no answer is an empty footer note, not an error.
  }
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ shipped: answer }));
}

type Handler = (req: import('http').IncomingMessage, res: import('http').ServerResponse) => void;

/** Answers JSON from a function of the request's query string. */
const json =
  (answer: (query: URLSearchParams) => Promise<unknown>): Handler =>
  async (req, res) => {
    const query = new URL(req.url ?? '', 'http://localhost').searchParams;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(await answer(query)));
  };

const ROUTES: Record<string, Handler> = {
  '/api/shipped': shipped,
  '/api/status': json(async () => ({ apps: await status() })),
  '/api/apps': json(async () => ({ apps: await manifests() })),
  '/api/check': json(async (q) => ({ check: await check(q.get('app') ?? '', q.get('q') ?? '') })),
};

function devApiPlugin(): Plugin {
  return {
    name: 'dev-api-shipped',
    configureServer(server) {
      for (const [path, handler] of Object.entries(ROUTES)) server.middlewares.use(path, handler);
    },
    configurePreviewServer(server) {
      for (const [path, handler] of Object.entries(ROUTES)) server.middlewares.use(path, handler);
    },
  };
}

export default devApiPlugin;
