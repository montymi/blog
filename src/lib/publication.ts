/** A publication's label, shared by cards, writing lists, and the board index. */
export function publicationName(url: string): string {
  const hostname = new URL(url).hostname.replace(/^www\./, '');
  if (hostname === 'blitzy.com' || hostname.endsWith('.blitzy.com')) return 'Blitzy';
  if (hostname === 'substack.com' || hostname.endsWith('.substack.com')) return 'Substack';
  return hostname;
}
