import type { VercelRequest, VercelResponse } from '@vercel/node';

import { check } from '../src/platform/server';

const one = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? '';

/**
 * GET /api/check?app=chef&q=plan 4 dinners for 2: the app's own reading of a sentence (the
 * montymi check protocol), asked from here so browsers need no cross-site access. Answers are
 * cached by sentence for five minutes; `{check: null}` means the app didn't answer.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
  return res.status(200).json({ check: await check(one(req.query.app), one(req.query.q)) });
}
