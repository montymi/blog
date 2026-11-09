/** "Nov 8, 2026" from "2026-11-08", read as a calendar day (no time zone shift). */
export function formatDate(iso: string, style: 'long' | 'short' = 'long'): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    ...(style === 'long' ? { year: 'numeric' } : {}),
  });
}
