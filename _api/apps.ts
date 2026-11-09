import type { VercelRequest, VercelResponse } from '@vercel/node';

import { manifests } from '../src/platform/server';

/** GET /api/apps: every app's manifest, live where it answers. Cached ten minutes. */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');
  return res.status(200).json({ apps: await manifests() });
}
