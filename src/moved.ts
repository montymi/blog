/**
 * Old addresses, renamed for what they hold. The server redirects them (vite.config.ts) and the
 * router does too, for links followed inside the site.
 */
export const MOVED: Record<string, string> = {
  '/blog': '/writing',
  '/library': '/papers',
  '/discography': '/projects',
  '/activity': '/about',
};
