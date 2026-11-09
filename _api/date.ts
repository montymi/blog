import type { VercelRequest, VercelResponse } from '@vercel/node';

// Relative import, not the `@/*` alias: this file is built by Vercel's own
// Node function bundler, not Vite, and isn't guaranteed to resolve
// tsconfig path aliases the way the Vite-built src/ tree does.
import { fetchHistoryEvents } from '../src/lib/historyApi';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const month = Array.isArray(req.query.month) ? req.query.month[0] : req.query.month ?? '';
  const day = Array.isArray(req.query.day) ? req.query.day[0] : req.query.day ?? '';

  const { status, body } = await fetchHistoryEvents(month, day);
  return res.status(status).json(body);
}
