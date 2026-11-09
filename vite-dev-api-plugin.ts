import type { Plugin } from 'vite';

import { fetchHistoryEvents } from './src/lib/historyApi';

/**
 * Vite never runs Vercel serverless functions (`_api/*.ts`) under `vite dev`
 * — `vite-plugin-vercel` only bundles them at build time — so `/api/date`
 * silently fell through to the SPA shell in local dev, returning HTML where
 * the frontend expected JSON. This middleware runs the same logic
 * (`fetchHistoryEvents`, shared with `_api/date.ts`) directly in the dev
 * server so the endpoint actually works locally too.
 */
function devApiPlugin(): Plugin {
  return {
    name: 'dev-api-date',
    configureServer(server) {
      server.middlewares.use('/api/date', async (req, res) => {
        const url = new URL(req.url ?? '', 'http://localhost');
        const month = url.searchParams.get('month') ?? '';
        const day = url.searchParams.get('day') ?? '';

        const { status, body } = await fetchHistoryEvents(month, day);

        res.statusCode = status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(body));
      });
    },
  };
}

export default devApiPlugin;
