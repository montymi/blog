import type { VercelRequest, VercelResponse } from '@vercel/node';

// Relative import, not the `@/*` alias: Vercel's function bundler builds this file, not Vite.
import { status } from '../src/platform/server';

/** GET /api/status: whether each app answers, for the front page. Cached a minute at the CDN. */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  return res.status(200).json({ apps: await status() });
}
