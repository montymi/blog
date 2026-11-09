import type { VercelRequest, VercelResponse } from '@vercel/node';

// Relative import, not the `@/*` alias: Vercel's function bundler builds this file, not Vite.
import { lastShipped } from '../src/lib/shipped';

/**
 * GET /api/shipped: the newest public commit, for the site's footer. The CDN keeps the answer
 * for ten minutes, so GitHub sees a few calls an hour however many people visit.
 */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');
  try {
    const shipped = await lastShipped('montymi', process.env.GITHUB_TOKEN);
    return res.status(200).json({ shipped });
  } catch {
    return res.status(200).json({ shipped: null });
  }
}
